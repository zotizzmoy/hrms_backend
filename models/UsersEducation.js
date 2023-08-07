//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const educationDetails = sequelize_db.define(
    "bank_details",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        board_name: {
            type: DataTypes.STRING
        },
        degree_name: {
            type: DataTypes.STRING
        },
        school_name: {
            type: DataTypes.STRING
        },
        passing_year: {
            type: DataTypes.STRING
        },
        percentage: {
            type: DataTypes.STRING
        },
        marks: {
            type: DataTypes.INTEGER
        }

    }



)





//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = educationDetails;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++