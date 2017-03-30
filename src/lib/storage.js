import { connection, mongo } from 'mongoose';
import GridFs from 'gridfs-stream';
import to from 'await-to-js';

import config from './config';

let gridFs;
connection.once('open', () => gridFs = GridFs(connection.db, mongo));

class GridFsStorage {
    constructor(options = {}) {
        this.getFileName = options.getFilename || config.getFilename;
        this.stream = options.stream || config.stream;
    }

    async _handleFile(request, file, callback) {
        const { getFileName, stream } = this;

        const [err, data] = await to(getFileName(request, file));

        if (err) callback(err, null);

        const outStream = gridFs.createWriteStream({ ...stream, filename: data });

        file.stream.pipe(outStream);

        outStream
            .on('error', callback)
            .on('close', file => callback(null, file));
    };

    async _removeFile(request, { _id }, callback) {
        const [err, data] = await to(gridFs.exist({_id}));

        if (err) callback(err, null)

        if (data) gridFs.remove({_id}, err => err ? callback(err, null) : callback(null, _id));
    };
}

export default GridFsStorage;