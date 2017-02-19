import fs from 'fs';
import path from 'path';
import stream from 'stream';
import onFinished from 'on-finished';

export default {
    file: name => fs.createReadStream(path.join(__dirname, 'files', name)),
    fileSize: path => fs.statSync(path).size,
    submitForm: (multer, form, cb) => {
        form.getLength((err, length) => {
            if (err) {
                return cb(err);
            }

            const req = new stream.PassThrough();

            req.complete = false;
            form.once('end', () => req.complete = true);

            form.pipe(req)
            req.headers = {
                'content-type': `multipart/form-data; boundary=${form.getBoundary()}`,
                'content-length': length
            }

            multer(req, null, err => onFinished(req, () => cb(err, req)));
        });
    }
}