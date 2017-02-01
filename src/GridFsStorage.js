import GridFs from 'gridfs-stream';
import mongoose from 'mongoose';

let gridFs;

mongoose.connection.once('open', () => gridFs = new GridFs(mongoose.connection.db, mongoose.mongo));

const defaultOptions = {
	getDestination: (request, file, callback) => callback(null),
	onUploadFinish: file => console.info(`Finish to upload file --> ${file}`),
	getFileName: file => file.originalname
};

class GridFsStorage {
	constructor(options) {
		this.getDestination = options.getDestination ||defaultOptions.getDestination;
		this.onUploadFinish = options.onUploadFinish || defaultOptions.onUploadFinish;
		this.getFileName = options.getFileName || defaultOptions.getFileName;
	}

	_handleFile = (request, file, callback) => {
		this.getDestination(request, file, error => {
			if (error) {
				return callback(error);
			}
			
			const outStream = gridFs.createWriteStream({
				filename: this.getFileName(file)
			});
			
			file.stream.pipe(outStream);
			
			outStream
				.on('error', error => callback(error))
				.on('close', insertedFile => callback(null, insertedFile))
				.on('finish', () => this.onUploadFinish(file))
		})
	};
	
	_removeFile = (request, file, callback) => {
		gridFs.exist({ _id: file._id }, (error, found) => {
			if (error) {
				callback(error);
			}
			
			if (found) {
				gridFs.remove({ _id: file._id }, error => {
					if (error) {
						callback(error);
					}
					
					callback(null, file._id);
				});
			}
		});
	};
}

export default GridFsStorage;
