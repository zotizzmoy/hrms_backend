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
    if (req.file) {
        // use Sharp to resize and compress the image
        sharp(req.file.path)
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toFile('public/uploads/' + req.file.filename.replace(/\.[^/.]+$/, "") + '.jpeg', (err, info) => {
                if (err) {
                    return next(err);
                }
                // delete the original file
                fs.unlinkSync(req.file.path);
                // add the compressed image filename to the request object
                req.file.filename = req.file.filename.replace(/\.[^/.]+$/, "") + '.jpeg';
                next();
            });
    } else {
        next();
    }
};

module.exports = { upload, compressImage };
