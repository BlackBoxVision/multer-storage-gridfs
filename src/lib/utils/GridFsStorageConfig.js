export default {
	getDestination: (request, file) => Promise.resolve(),
	getFilename: (request, file) => Promise.resolve(file.originalname),
	streamOptions: {}
}