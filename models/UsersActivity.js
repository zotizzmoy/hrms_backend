const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");
const UserModel = require("../models/Users")
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const UserActivity = sequelize_db.define(
  "users_activity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.STRING,
    },
    activity: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },

  },
  {
    timestamps: false,
  }
);




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = UserActivity;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
