export default {
    getFilename: (request, file) => Promise.resolve(file.originalname),
    streamOptions: {}
}