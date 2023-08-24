const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs/promises'); // Import the promises version of fs

const storage = multer.memoryStorage(); // Use memory storage for processing
const upload = multer({ storage: storage });

const processAndCompressImage = async (file) => {
    const compressedBuffer = await sharp(file.buffer)
        .resize(600) // Resize the image to a desired width (adjust as needed)
        .toBuffer();

    return compressedBuffer;
};

module.exports = upload.single('image'), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const compressedBuffer = await processAndCompressImage(req.file);

        const compressedFileName = `compressed-${Date.now()}-${req.file.originalname}`;
        const compressedFilePath = `./public/uploads/${compressedFileName}`;

        await fs.writeFile(compressedFilePath, compressedBuffer);

        req.body.compressedFileName = compressedFileName;

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Image processing error.' });
    }
};
