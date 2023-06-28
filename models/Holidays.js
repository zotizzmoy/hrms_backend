const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");

const Holiday = sequelize_db.define('Holiday', {
  day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Holiday;