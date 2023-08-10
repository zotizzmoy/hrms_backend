//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const personalDetails = sequelize_db.define(
    "user_personal_detail",
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
            type: DataTypes.STRING
        },
        emergency_contact_no: {
            type: DataTypes.STRING
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
        },
        created_at: {
            type: DataTypes.DATE
        },
        updated_at: {
            type: DataTypes.DATE
        }

    },
    {
        timestamps: false,
        underscored: true,
        paranoid: false,
    }
);



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = personalDetails;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
