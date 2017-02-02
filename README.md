# multer-gridfs
> :minidisc: Multer Storage Engine is the simplest way to save your files to MongoDB GridFs backed by multer

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/multer-storage-gridfs.svg)](https://badge.fury.io/js/multer-storage-gridfs)


##Installation

**YARN**

```javascript
yarn add multer-storage-gridfs 
```

**NPM**

```javascript
npm install --save multer-storage-gridfs 
```

##Usage

The usage is really simple:

```javascript
import multer from 'multer';
import GridFsStorage from 'multer-storage-gridfs';

const upload = multer({ 
    storage: new GridFsStorage()
});
```

**GridFsStorage** listens to mongoose connection **"open"** event. When this event is fired, internally generates a **GridFsStream** instance and it handles the methods provided for multer custom storage. 

##Issues

If you found a bug, or you have an answer, or whatever. Please, open an [issue](https://github.com/BlackBoxVision/multer-gridfs/issues). I will do the best to fix it, or help you.

##Contributing

Of course, if you see something that you want to upgrade from this library, or a bug that needs to be solved, **PRs are welcome!**

##License

Distributed under the **MIT license**. See [LICENSE](https://github.com/BlackBoxVision/multer-gridfs/blob/master/LICENSE) for more information.
