//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const UserAttendence = sequelize_db.define(
  "user_attendence",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },

    location: {
      type: DataTypes.STRING,
    },
    in_date: {
      type: DataTypes.STRING,
    },
    in_time: {
      type: DataTypes.STRING,
    },
    in_distance: {
      type: DataTypes.STRING,
    },
    in_office: {
      type: DataTypes.STRING,
    },
    out_date: {
      type: DataTypes.STRING,
    },
    out_time: {
      type: DataTypes.STRING,
    },
    out_distance: {
      type: DataTypes.STRING,
    },
    out_office: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("on time", "late"),
    },
    attendance_status: {
      type: DataTypes.STRING,
      defaultValue: "absent",
    },
    type: {
      type: DataTypes.INTEGER,
    },
    msg: {
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
module.exports = UserAttendence;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
