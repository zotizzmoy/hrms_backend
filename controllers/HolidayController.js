const { Sequelize } = require('sequelize');

const Holiday = require('../models/Holidays')






module.exports.getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.findAll();
        res.json(holidays);
    } catch (error) {
        console.error('Error fetching holidays:', error);
        res.status(500).json({ error: 'Failed to fetch holidays' });
    }

};


module.exports.createHoliday = async (req, res) => {
    const { day, date, name } = req.body;
    try {
        const holiday = await Holiday.create({ day, date, name });
        res.status(201).json(holiday);
    } catch (error) {
        console.error('Error creating holiday:', error);
        res.status(500).json({ error: 'Failed to create holiday' });
    }

};

module.exports.updateHoliday = async (req, res) => {
    const { id } = req.params;
    const { day, date, name } = req.body;
    try {
        const holiday = await Holiday.findByPk(id);
        if (holiday) {
            holiday.day = day;
            holiday.date = date;
            holiday.name = name;
            await holiday.save();
            res.json(holiday);
        } else {
            res.status(404).json({ error: 'Holiday not found' });
        }
    } catch (error) {
        console.error('Error updating holiday:', error);
        res.status(500).json({ error: 'Failed to update holiday' });
    }

};

module.exports.deleteHoliday = async (req, res) => {
    const { id } = req.params;

    try {
        const holiday = await Holiday.findByPk(id);
        if (holiday) {
            await Holiday.destroy({
                where: {
                    id: id
                }
            });
            res.status(200).json({ msg: 'Holiday deleted successfully' });
        } else {
            res.status(404).json({ error: 'Holiday not found' });
        }
    } catch (error) {
        console.error('Error deleting holiday:', error);
        res.status(500).json({ error: 'Failed to delete holiday' });
    }

};


module.exports.upcomingHoliday = async (req, res) => {
    try {
        // Find the upcoming holiday
        const upcomingHoliday = await Holiday.findOne({
            where: {
                date: {
                    [Sequelize.Op.gte]: Sequelize.literal('CURDATE()'), // Use sequelize.literal to convert string date into a date object
                },
            },
            order: [['date', 'ASC']],
        });

        res.status(200).json(upcomingHoliday);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }



};