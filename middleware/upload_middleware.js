const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

// define the storage location and filename for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.fieldname);
    }
});
const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'));
    }
};

// define the multer instance with the storage options
const upload = multer({ storage: storage, fileFilter: fileFilter });

// define the middleware function to compress images
const compressImage = (req, res, next) => {
    if (req.files && req.files.length > 0) {
        // If there are multiple files, process each one
        const compressedFiles = [];

        req.files.forEach(file => {
            const outputFile = 'public/uploads/' + file.filename.replace(/\.[^/.]+$/, "") + '.jpeg';

            sharp(file.path)
                .toFormat('jpeg')
                .jpeg({ quality: 80 })
                .toFile(outputFile, (err, info) => {
                    if (err) {
                        return next(err);
                    }
                    // Delete the original file
                    fs.unlinkSync(file.path);
                    // Add the compressed image filename to the request object
                    compressedFiles.push(file.filename.replace(/\.[^/.]+$/, "") + '.jpeg');

                    if (compressedFiles.length === req.files.length) {
                        req.compressedFiles = compressedFiles;
                        next();
                    }
                });
        });
    } else if (req.file) {
        // If there's a single file
        sharp(req.file.path)
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toFile('public/uploads/' + req.file.filename.replace(/\.[^/.]+$/, "") + '.jpeg', (err, info) => {
                if (err) {
                    return next(err);
                }
                // Delete the original file
                fs.unlinkSync(req.file.path);
                // Add the compressed image filename to the request object
                req.file.filename = req.file.filename.replace(/\.[^/.]+$/, "") + '.jpeg';
                next();
            });
    } else {
        next();
    }
};


module.exports = { upload, compressImage };
