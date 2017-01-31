import GridFs from 'gridfs-stream';
import mongoose from 'mongoose';

const conn = mongoose.connection;
let gridFs;

conn.once('open', () => {
    gridFs = GridFs(conn.db, mongoose.mongo);
});

const getDestination = (req, file, cb) => cb(null);

class GridFsStorage {
	constructor(options) {
		this.getDestination = options.destination || getDestination;
	}

	_handleFile = (req, file, cb) => {
		this.getDestination(req, file, (err) => {
			if (err) return cb(err);
			
			const outStream = gridFs.createWriteStream({filename: file.originalname});
			
			file.stream.pipe(outStream);
			
			outStream
				.on('error', cb)
				.on('close', (insertedFile) => cb(null, insertedFile))
				.on('finish', () => console.info(`Finish to upload file --> ${file}`))
		})
	};
	
	_removeFile = (req, file, cb) => {
		gridFs.exist({ _id: file._id }, (err, found) => {
			if (err) cb(err);
			
			if (found) {
				gridFs.remove({ _id: file._id }, (err) => {
					if (err) cb(err);
					
					cb(null, { message: `Successful delete file with id --> ${file._id}` });
				});
			}
		});
	};
}

export default GridFsStorage;
