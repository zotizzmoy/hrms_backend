const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const compressImage = (req, res, next) => {
    if (req.files && req.files.length > 0) {
        req.compressedFiles = [];

        req.files.forEach(file => {
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
                    req.compressedFiles.push(outputFilename);
                    if (req.compressedFiles.length === req.files.length) {
                        next();
                    }
                });
        });
    } else {
        next();
    }
};


module.exports = { upload, compressImage };
