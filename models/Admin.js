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
sequelize_db.sync({ force: false }).then(() => {
    console.log('');
  }).catch((error) => {
    console.error('Error syncing models:', error);
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = AdminModel;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++