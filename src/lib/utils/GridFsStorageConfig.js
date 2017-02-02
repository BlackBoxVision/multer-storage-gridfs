export default {
	getDestination: (request, file, callback) => callback(null),
	onUploadFinish: file => console.info(`Finish to upload file --> ${file}`),
	getFileName: file => file.originalname,
	streamOptions: {}
}