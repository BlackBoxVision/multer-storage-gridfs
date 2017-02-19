export default {
	getDestination: (request, file, callback) => callback(null),
	onUploadFinish: file => console.info(`Finish to upload file --> ${JSON.stringify(file)}`),
	getFileName: file => file.originalname,
	streamOptions: {}
}