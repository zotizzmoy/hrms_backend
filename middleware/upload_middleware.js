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
// ...

const compressImage = (req, res, next) => {
    // If it's a single file upload
    if (req.file) {
        const file = req.file;
        const originalExtension = file.originalname.split('.').pop();

        const filenameWithoutExtension = file.filename.replace(/\.[^/.]+$/, "");
        const outputFilename = filenameWithoutExtension + '.jpeg';

        sharp(file.path)
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toFile('public/uploads/' + outputFilename, (err, info) => {
                if (err) {
                    return next(err);
                }
                fs.unlinkSync(file.path);
                req.file.filename = outputFilename;
                next();
            });
    }
    // If it's a multiple file upload
    else if (req.files && req.files.length > 0) {
        const compressedFiles = [];

        req.files.forEach(file => {
            const filenameWithoutExtension = file.filename.replace(/\.[^/.]+$/, "");
            const outputFile = filenameWithoutExtension + '-compressed.jpeg';

            sharp(file.path)
                .toFormat('jpeg')
                .jpeg({ quality: 80 })
                .toFile('public/uploads/' + outputFile, (err, info) => {
                    if (err) {
                        return next(err);
                    }
                    fs.unlinkSync(file.path);
                    compressedFiles.push(outputFile);

                    if (compressedFiles.length === req.files.length) {
                        req.compressedFiles = compressedFiles;
                        next();
                    }
                });
        });
    } else {
        next();
    }
};






module.exports = { upload, compressImage };
