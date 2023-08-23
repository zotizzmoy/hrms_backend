const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp'); // Import the sharp library for image compression

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

const moveAndCompressImage = async (file, outputFilename) => {
    const destinationPath = 'public/uploads/' + outputFilename;

    await sharp(file.path)
        .resize(800) // Resize the image to a maximum width of 800 pixels (you can adjust this value)
        .toFile(destinationPath);

    fs.unlinkSync(file.path); // Remove the original uncompressed image

    return outputFilename;
};

const moveAndCompressImages = async (files) => {
    const compressedFiles = [];

    for (const file of files) {
        const outputFilename = await moveAndCompressImage(file, file.filename);
        compressedFiles.push(outputFilename);
    }

    return compressedFiles;
};

const moveImage = async (req, res, next) => {
    if (req.file) {
        req.compressedFiles = [await moveAndCompressImage(req.file, req.file.filename)];
        next();
    } else if (req.files && req.files.length > 0) {
        req.compressedFiles = await moveAndCompressImages(req.files);
        next();
    } else {
        next();
    }
};

module.exports = { upload, moveImage };
