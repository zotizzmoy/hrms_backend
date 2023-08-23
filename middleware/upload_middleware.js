const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const async = require('async');

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

const fileSizeLimit = 1 * 1024 * 1024; // 1MB in bytes

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: fileSizeLimit
    }
});

const compressAndMoveImage = async (file, callback) => {
    const outputFilename = 'compressed-' + file.filename;
    const destinationPath = 'public/uploads/' + outputFilename;

    await sharp(file.path)
        .resize(800) // Resize the image to a maximum width of 800 pixels (you can adjust this value)
        .toFile(destinationPath);

    callback(null, outputFilename);
};

const moveAndCompressImages = async (files, callback) => {
    const compressedFiles = [];

    const queue = async.queue(async (file, queueCallback) => {
        const outputFilename = await compressAndMoveImage(file);
        compressedFiles.push(outputFilename);
        queueCallback();
    });

    queue.drain(() => {
        callback(null, compressedFiles);
    });

    queue.push(files);
};

const moveImage = async (req, res, next) => {
    if (req.file) {
        req.compressedFiles = [await compressAndMoveImage(req.file)];
        next();
    } else if (req.files && req.files.length > 0) {
        moveAndCompressImages(req.files, (err, compressedFiles) => {
            if (err) {
                console.error(err);
                req.compressedFiles = [];
            } else {
                req.compressedFiles = compressedFiles;
            }
            next();
        });
    } else {
        next();
    }
};

module.exports = { upload, moveImage };
