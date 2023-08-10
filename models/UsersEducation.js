//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const educationDetails = sequelize_db.define(
    "user_education_detail",
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

    }




)





//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = educationDetails;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++