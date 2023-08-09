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
    // If it's a single file upload
    if (req.file) {
        const file = req.file;
        const originalExtension = file.originalname.split('.').pop(); // Get the original extension

        sharp(file.path)
            .toFormat('jpeg')  // Convert to JPEG format
            .jpeg({ quality: 80 })  // Set JPEG quality
            .toFile('public/uploads/' + file.filename.replace(/\.[^/.]+$/, "") + '.' + originalExtension, (err, info) => {
                if (err) {
                    return next(err);
                }
                fs.unlinkSync(file.path);
                req.file.filename = file.filename.replace(/\.[^/.]+$/, "") + '.' + originalExtension;
                next();
            });
    }
    // If it's a multiple file upload
    else if (req.files && req.files.length > 0) {
        const compressedFiles = [];

        req.files.forEach(file => {
            const originalExtension = file.originalname.split('.').pop(); // Get the original extension
            const outputFile = 'public/uploads/' + file.filename.replace(/\.[^/.]+$/, "") + '.' + originalExtension + '.jpeg';

            sharp(file.path)
                .toFormat('jpeg')  // Convert to JPEG format
                .jpeg({ quality: 80 })  // Set JPEG quality
                .toFile(outputFile, (err, info) => {
                    if (err) {
                        return next(err);
                    }
                    fs.unlinkSync(file.path);
                    compressedFiles.push(file.filename.replace(/\.[^/.]+$/, "") + '.' + originalExtension + '.jpeg');

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
