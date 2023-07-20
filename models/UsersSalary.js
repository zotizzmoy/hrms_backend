//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const userSalary = sequelize_db.define(
  "user_salaries",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    label: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    working_days: {
      type: DataTypes.INTEGER,
    },
    present_days: {
      type: DataTypes.INTEGER,
    },
    month: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.STRING,
    },
    leaves: {
      type: DataTypes.INTEGER,
    },
    late: {
      type: DataTypes.INTEGER,
    },
    gross_salary: {
      type: DataTypes.INTEGER,
    },
    epf: {
      type: DataTypes.INTEGER,
    },
    esic: {
      type: DataTypes.INTEGER,
    },
    professional_tax: {
      type: DataTypes.INTEGER,
    },
    late_days_deduction: {
      type: DataTypes.INTEGER,
    },
    leave_days_deduction: {
      type: DataTypes.INTEGER,
    },
    total_deductions: {
      type: DataTypes.INTEGER,
    },
    net_salary: {
      type: DataTypes.INTEGER,
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
module.exports = userSalary;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
