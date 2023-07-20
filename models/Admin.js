const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");

const AdminModel = sequelize_db.define(
    "admins",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 1,

        },
    },
    {
        timestamps: false,

    }



);


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = AdminModel;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++