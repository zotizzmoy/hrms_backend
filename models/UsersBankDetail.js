//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const bankDetails = sequelize_db.define(
    "user_bank_detail",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        bank_name: {
            type: DataTypes.STRING
        },
        account_holder_name: {
            type: DataTypes.STRING
        },
        branch_name: {
            type: DataTypes.STRING
        },
        ifsc: {
            type: DataTypes.STRING
        },
        account_number: {
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
module.exports = bankDetails;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++