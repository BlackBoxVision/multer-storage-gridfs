export default {
	getDestination: (request, file, callback) => callback(null),
	onUploadFinish: file => {},
	getFileName: file => file.originalname,
	streamOptions: {}
}