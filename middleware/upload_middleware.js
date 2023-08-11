const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.fieldname);
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

const moveImage = (req, res, next) => {
    if (req.file) {
        const file = req.file;
        const outputFilename = file.filename;

        const destinationPath = 'public/uploads/' + outputFilename;
        fs.renameSync(file.path, destinationPath);

        req.compressedFiles = [outputFilename];
        next();
    } else if (req.files && req.files.length > 0) {
        req.compressedFiles = [];

        req.files.forEach(file => {
            const outputFilename = file.filename;
            const destinationPath = 'public/uploads/' + outputFilename;
            fs.renameSync(file.path, destinationPath);

            req.compressedFiles.push(outputFilename);
        });

        next();
    } else {
        next();
    }
};

module.exports = { upload, moveImage };
