const { DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");

const ResetToken = sequelize_db.define("reset_token", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = ResetToken;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
