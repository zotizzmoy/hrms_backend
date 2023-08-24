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


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
   
});

const compressAndReplaceImage = async (file, callback) => {
    const outputFilename = file.filename;

    await sharp(file.path)
        .resize(800) // Resize the image to a maximum width of 800 pixels (you can adjust this value)
        .toFile('public/uploads/' + outputFilename);

    fs.unlinkSync(file.path); // Remove the original file

    callback(null, outputFilename);
};

const compressAndReplaceImages = async (files, callback) => {
    const compressedFiles = [];

    const queue = async.queue(async (file, queueCallback) => {
        const outputFilename = await compressAndReplaceImage(file);
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
        req.compressedFiles = [await compressAndReplaceImage(req.file)];
        req.body.compressedFiles = req.compressedFiles; // Update req.body with compressed file names
        next();
    } else if (req.files && req.files.length > 0) {
        compressAndReplaceImages(req.files, (err, compressedFiles) => {
            if (err) {
                console.error(err);
                req.compressedFiles = [];
            } else {
                req.compressedFiles = compressedFiles;
                req.body.compressedFiles = compressedFiles; // Update req.body with compressed file names
            }
            next();
        });
    } else {
        next();
    }
};

module.exports = { upload, moveImage };
