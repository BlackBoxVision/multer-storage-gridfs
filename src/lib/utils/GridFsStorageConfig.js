export default {
	getDestination: (request, file) => new Promise((resolve, reject) => resolve()),
	getFilename: (request, file) => new Promise((resolve, reject) => resolve(file.originalname)),
	streamOptions: {}
}