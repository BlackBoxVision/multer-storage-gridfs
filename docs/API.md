# API Docs

## How it works

**GridFsStorage** listens to mongoose connection **"open"** event. When this event is fired, internally generates a **GridFsStream** instance and it handles the methods provided for multer custom storage. 

## Usage

The usage is really simple:

```javascript
import multer from 'multer';
import { GridFsStorage } from 'multer-storage-gridfs';

const upload = multer({ 
    storage: new GridFsStorage()
});
```

You can customize the behavior of the storage by passing an object: 

```javascript
import multer from 'multer';
import { GridFsStorage } from 'multer-storage-gridfs';

//Example object with custom behavior
const options = {
	getFilename: (request, file) => Promise.resolve(file.originalname),
	stream: {
        mode: 'w', 
        chunkSize: 1024,
        content_type: 'plain/text', 
        root: 'my_collection',
        metadata: {
            ...
        }
    }
}

const upload = multer({ 
    storage: new GridFsStorage(options)
});
```
