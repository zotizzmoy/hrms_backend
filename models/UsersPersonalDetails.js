//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const personalDetails = sequelize_db.define(
    "personal_details",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,

        },
        marital_status: {
            type: DataTypes.STRING
        },
        father_name: {
            type: DataTypes.STRING
        },
        mother_name: {
            type: DataTypes.STRING
        },
        phone_no: {
            type: DataTypes.INTEGER
        },
        emergency_contact_no: {
            type: DataTypes.INTEGER
        },
        uan_no: {
            type: DataTypes.STRING
        },
        esic: {
            type: DataTypes.STRING
        },
        pan_no: {
            type: DataTypes.STRING
        },
        aadhar_no: {
            type: DataTypes.STRING
        },
        present_address: {
            type: DataTypes.STRING
        },
        permanent_address: {
            type: DataTypes.STRING
        }
    }
);

async function syncDatabase() {
    try {
        await sequelize_db.sync({ force: false }); // Change to true to force sync (drops existing tables)
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Error synchronizing database:", error);
    }
}

syncDatabase(); // Call the function to start the synchronization process

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = personalDetails;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
