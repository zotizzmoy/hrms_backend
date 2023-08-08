//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const userDocument = sequelize_db.define(
    "user_document",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        document: {
            type: DataTypes.STRING
        },
        document_name: {
            type: DataTypes.STRING
        },
        document_destination: {
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

    }

)





//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = userDocument;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++