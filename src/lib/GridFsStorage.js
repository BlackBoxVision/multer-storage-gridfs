import defaultOptions from './utils/GridFsStorageConfig';
import GridFs from 'gridfs-stream';
import mongoose from 'mongoose';

const connection = mongoose.connection;
let gridFs;

connection.once('open', () => gridFs = GridFs(connection.db, mongoose.mongo));

class GridFsStorage {
	constructor(options = {}) {
		this.getDestination = defaultOptions.getDestination;
		this.getFileName = options.getFilename || defaultOptions.getFilename;
		this.streamOptions = options.streamOptions || defaultOptions.streamOptions;
	}

	_handleFile = (request, file, callback) => {
		this.getDestination(request, file).then(() => {
            this.getFileName(request, file).then(filename => {
                const outStream = gridFs.createWriteStream({
                    ...this.streamOptions,
                    filename
                });

                file.stream.pipe(outStream);

                outStream
                    .on('error', callback)
                    .on('close', file => callback(null, file));
            });
        });
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