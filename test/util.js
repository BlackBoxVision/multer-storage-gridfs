import fs from 'fs';
import path from 'path';
import stream from 'stream';
import onFinished from 'on-finished';

export default {
    file: name => fs.createReadStream(path.join(__dirname, 'files', name)),
    submitForm: (multer, form, cb) => {
        form.getLength((err, length) => {
            if (err) {
                return cb(err);
            }

            const request = new stream.PassThrough();

            request.complete = false;
            form.once('end', () => request.complete = true);

            form.pipe(request);
            request.headers = {
                'content-type': `multipart/form-data; boundary=${form.getBoundary()}`,
                'content-length': length
            };

            multer(request, null, err => onFinished(request, () => cb(err, request)));
        });
    }
}