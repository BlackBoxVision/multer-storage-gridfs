import defaultOptions from './config';
import { connection, mongo } from 'mongoose';
import GridFs from 'gridfs-stream';
import to from 'await-to-js';

let gridFs;
connection.once('open', () => gridFs = GridFs(connection.db, mongo));

class GridFsStorage {
    constructor(options = {}) {
        this.getFileName = options.getFilename || defaultOptions.getFilename;
        this.streamOptions = options.streamOptions || defaultOptions.streamOptions;
    }

    _handleFile = async (request, file, callback) => {
        const [err, data] = await to(this.getFileName(request, file));

        if (err) callback(err);

        const outStream = gridFs.createWriteStream({
            ...this.streamOptions,
            filename: data
        });

        file.stream.pipe(outStream);

        outStream
            .on('error', callback)
            .on('close', file => callback(null, file));
    };

    _removeFile = (request, file, callback) => {
        gridFs.exist({_id: file._id}, (error, found) => {
            if (error) callback(error);

            if (found) {
                gridFs.remove({_id: file._id}, error => error ? callback(error) : callback(null, file._id));
            }
        });
    };
}

export default GridFsStorage;