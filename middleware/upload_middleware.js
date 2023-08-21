const multer = require('multer');
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

// Add a file size limiter (e.g., 2MB)
const fileSizeLimit = 1 * 1024 * 1024; // 1MB in bytes

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: fileSizeLimit
    }
});

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
