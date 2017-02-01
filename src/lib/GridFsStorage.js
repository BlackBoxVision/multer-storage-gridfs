import createGridFsStream from './factory/GridFsStreamFactory';
import defaultOptions from './utils/GridFsStorageConfig';

const gridFs = createGridFsStream();

class GridFsStorage {
	constructor(options) {
		this.getDestination = options.getDestination || defaultOptions.getDestination;
		this.onUploadFinish = options.onUploadFinish || defaultOptions.onUploadFinish;
		this.getFileName = options.getFileName || defaultOptions.getFileName;
	}

	_handleFile = (request, file, callback) => {
		this.getDestination(request, file, error => {
			if (error) {
				return callback(error);
			}
			
			if (gridFs) {
				const outStream = gridFs.createWriteStream({
					filename: this.getFileName(file)
				});
				
				file.stream.pipe(outStream);
				
				outStream
					.on('error', error => callback(error))
					.on('close', insertedFile => callback(null, insertedFile))
					.on('finish', () => this.onUploadFinish(file))
			} else {
				return callback(new Error("GridFs is null, please initialize mongoose connection"));
			}
		})
	};
	
	_removeFile = (request, file, callback) => {
		if (gridFs) {
			gridFs.exist({_id: file._id}, (error, found) => {
				if (error) {
					callback(error);
				}
				
				if (found) {
					gridFs.remove({_id: file._id}, error => error ? callback(error) : callback(null, file._id));
				}
			});
		} else {
			return callback(new Error("GridFs is null, please initialize mongoose connection"));
		}
	};
}

export default GridFsStorage;
