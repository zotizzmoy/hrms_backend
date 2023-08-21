//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const UserLeave = sequelize_db.define(
  "user_leave",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },

    leave_type: {
      type: DataTypes.STRING,
    },
    is_half_day: {
      type: DataTypes.STRING,
    },

    applied_on: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.STRING,
    },
    end_date: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.INTEGER
    },

    reason: {
      type: DataTypes.STRING,
    },
    cancel_reason:{
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM("Awaiting", "Approved", "Cancelled"),
    },
    document: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    underscored: true,
    paranoid: false,
  }
);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = UserLeave;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
