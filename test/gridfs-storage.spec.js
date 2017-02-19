import assert from 'assert';
import multer from 'multer';
import FormData from 'form-data';
import GridFs from 'gridfs-stream';

import mongoose from 'mongoose';

import GridFsStorage from '../src/lib/GridFsStorage';
import util from './util';

let upload;
let gridFs;

const mongo = {
    local: 'mongodb://localhost:27017',
    remote: 'mongodb://127.0.0.1:27017'
}

mongoose.connect(process.env.BUILD_ENABLE ? mongo.remote : mongo.local , err => {
    if (err) {
        console.info(`An error ocurred during app init: -> ${err}`);
    }

    upload = multer({
        storage: new GridFsStorage()
    });
});

describe('Testing -> GridFS Storage', () => {
    it('should process parser/form-data POST request', done => {
        const form = new FormData();
        const parser = upload.single('small0');

        form.append('name', 'Multer')
        form.append('small0', util.file('small0.dat'))

        util.submitForm(parser, form, (err, req) => {
            assert.ifError(err);

            assert.equal(req.body.name, 'Multer');

            assert.equal(req.file.fieldname, 'small0');
            assert.equal(req.file.originalname, 'small0.dat');
            assert.equal(req.file.length, 1778);

            done();
        });
    });

    it('should process empty fields and an empty file', done => {
        const form = new FormData();
        const parser = upload.single('empty');

        form.append('empty', util.file('empty.dat'));
        form.append('name', 'Multer');
        form.append('version', '');
        form.append('year', '');
        form.append('checkboxfull', 'cb1');
        form.append('checkboxfull', 'cb2');
        form.append('checkboxhalfempty', 'cb1');
        form.append('checkboxhalfempty', '');
        form.append('checkboxempty', '');
        form.append('checkboxempty', '');

        util.submitForm(parser, form, (err, req) => {
            assert.ifError(err);

            assert.equal(req.body.name, 'Multer');
            assert.equal(req.body.version, '');
            assert.equal(req.body.year, '');

            assert.deepEqual(req.body.checkboxfull, [ 'cb1', 'cb2' ]);
            assert.deepEqual(req.body.checkboxhalfempty, [ 'cb1', '' ]);
            assert.deepEqual(req.body.checkboxempty, [ '', '' ]);

            assert.equal(req.file.fieldname, 'empty');
            assert.equal(req.file.originalname, 'empty.dat');
            assert.equal(req.file.length, 0);

            done();
        });
    });

    it('should process multiple files', done => {
        const form = new FormData()
        const parser = upload.fields([
            { name: 'empty', maxCount: 1 },
            { name: 'tiny0', maxCount: 1 },
            { name: 'tiny1', maxCount: 1 },
            { name: 'small0', maxCount: 1 },
            { name: 'small1', maxCount: 1 },
            { name: 'medium', maxCount: 1 },
            { name: 'large', maxCount: 1 }
        ])

        form.append('empty', util.file('empty.dat'));
        form.append('tiny0', util.file('tiny0.dat'));
        form.append('tiny1', util.file('tiny1.dat'));
        form.append('small0', util.file('small0.dat'));
        form.append('small1', util.file('small1.dat'));
        form.append('medium', util.file('medium.dat'));
        form.append('large', util.file('large.jpg'));

        util.submitForm(parser, form, (err, req) => {
            assert.ifError(err);

            assert.deepEqual(req.body, {});

            assert.equal(req.files['empty'][0].fieldname, 'empty');
            assert.equal(req.files['empty'][0].originalname, 'empty.dat');
            assert.equal(req.files['empty'][0].length, 0);

            assert.equal(req.files['tiny0'][0].fieldname, 'tiny0');
            assert.equal(req.files['tiny0'][0].originalname, 'tiny0.dat');
            assert.equal(req.files['tiny0'][0].length, 122);

            assert.equal(req.files['tiny1'][0].fieldname, 'tiny1');
            assert.equal(req.files['tiny1'][0].originalname, 'tiny1.dat');
            assert.equal(req.files['tiny1'][0].length, 7);

            assert.equal(req.files['small0'][0].fieldname, 'small0');
            assert.equal(req.files['small0'][0].originalname, 'small0.dat');
            assert.equal(req.files['small0'][0].length, 1778);

            assert.equal(req.files['small1'][0].fieldname, 'small1');
            assert.equal(req.files['small1'][0].originalname, 'small1.dat');
            assert.equal(req.files['small1'][0].length, 315);

            assert.equal(req.files['medium'][0].fieldname, 'medium');
            assert.equal(req.files['medium'][0].originalname, 'medium.dat');
            assert.equal(req.files['medium'][0].length, 13196);

            assert.equal(req.files['large'][0].fieldname, 'large');
            assert.equal(req.files['large'][0].originalname, 'large.jpg');
            assert.equal(req.files['large'][0].length, 2413677);

            done();
        });
    });

    //TODO Review this test
    //it('should remove uploaded files on error', done => {
        //const connection = mongoose.connection;
        //connection.once('open', () => gridFs = GridFs(connection.db, mongoose.mongo));

        //const form = new FormData();
        //const parser = upload.single('tiny0');

        //form.append('tiny0', util.file('tiny0.dat'));
        //form.append('small0', util.file('small0.dat'));

        //util.submitForm(parser, form, (err, req) => {
            //assert.equal(err.code, 'LIMIT_UNEXPECTED_FILE');
            //assert.equal(err.field, 'small0');
            //assert.deepEqual(err.storageErrors, []);

            //TODO review
            //gridFs.files.find({}).toArray((err, files) => assert.deepEqual(files, []));

            //done();
        //});
    //});
});