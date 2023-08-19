//Models
const bankDetails = require("../models/UsersBankDetail");
const userDocument = require("../models/UsersDocument");
const educationDetails = require("../models/UsersEducation");
const personalDetails = require("../models/UsersPersonalDetail");


module.exports.documentsUpload = async (req, res) => {
    try {
        
        const { user_id , document_names } = req.body; // An array of document names
        const documents = req.files;

        if (!documents || !Array.isArray(documents) || !document_names || !Array.isArray(document_names) || documents.length !== document_names.length) {
            return res.status(400).json({ error: 'Invalid input format.' });
        }

        const documentEntries = [];

        for (let i = 0; i < documents.length; i++) {
            const file = documents[i];
            const documentEntry = {
                user_id,
                document: file.filename,
                document_name: document_names[i] || file.originalname,
                document_destination: file.destination,
                created_at: new Date(),
                updated_at: new Date()
            };
            documentEntries.push(documentEntry);
        }

        await userDocument.bulkCreate(documentEntries);

        res.status(201).json({
            message: 'Files uploaded and document entries created.',
            documents: documentEntries
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'An error occurred while uploading the files.' });
    }


};

module.exports.addPersonalDetails = async (req, res) => {
    try {
        const newPersonalDetail = await personalDetails.create(req.body);
        res.status(201).json(newPersonalDetail);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.updatePersonalDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRowsCount, updatedRows] = await personalDetails.update(req.body, {
            where: { id },
            returning: true,
        });

        if (updatedRowsCount === 0) {
            res.status(404).json({ error: 'Personal detail not found' });
        } else {
            res.status(200).json(updatedRows[0]);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

module.exports.addBankDetails = async (req, res) => {
    try {
        const bank = await bankDetails.create(req.body);
        res.status(201).json(bank);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

module.exports.updateBankDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const bank = await bankDetails.findByPk(id);
        if (bank) {
            await bankDetails.update(req.body)
        } else {
            return res.status(404).json({ message: "No Bank found" });
        }
        res.status(200).json(await bankDetails.findOne({
            where: { id }
        }));
    } catch (error) {
        res.status(500).json(error.message);
    }
};

module.exports.addUserEducation = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Request body must be an array of objects." });
        }

        const educations = [];

        for (const educationData of req.body) {
            const education = await educationDetails.create(educationData);
            educations.push(education);
        }

        res.status(201).json(educations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }



};

module.exports.updateUserEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const education = await educationDetails.findByPk(id);
        if (education) {
            await educationDetails.update(req.body)
        } else {
            return res.status(404).json({ message: "No eduation details found" });
        }
        res.status(200).json(await educationDetails.findOne({
            where: { id }
        }));
    } catch (error) {
        res.status(500).json(error.message);
    }
}