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

const moveImage = async (req, res, next) => {
    if (req.file) {
        const file = req.file;
        const outputFilename = file.filename;
        const destinationPath = 'public/uploads/' + outputFilename;

        try {
            await sharp(file.path)
                .resize(800) // You can adjust the desired dimensions here
                .toFile(destinationPath);

            fs.unlinkSync(file.path); // Delete the original unresized image

            req.compressedFiles = [outputFilename];
            next();
        } catch (error) {
            next(error);
        }
    } else if (req.files && req.files.length > 0) {
        req.compressedFiles = [];

        for (const file of req.files) {
            const outputFilename = file.filename;
            const destinationPath = 'public/uploads/' + outputFilename;

            try {
                await sharp(file.path)
                    .resize(800) // You can adjust the desired dimensions here
                    .toFile(destinationPath);

                fs.unlinkSync(file.path); // Delete the original unresized image

                req.compressedFiles.push(outputFilename);
            } catch (error) {
                next(error);
                return;
            }
        }

        next();
    } else {
        next();
    }
};






module.exports = { upload, moveImage };
