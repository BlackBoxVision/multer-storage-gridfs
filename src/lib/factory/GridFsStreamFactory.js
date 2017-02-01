import GridFs from 'gridfs-stream';
import mongoose from 'mongoose';

export default function createGridFsStream() {
	const connection = mongoose.connection;
	let gridFs = null;
	
	connection.once('open', () => {
		gridFs = new GridFs(connection.db, mongoose.mongo)
	});
	
	return gridFs;
}