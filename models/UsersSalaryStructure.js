//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//MODEL DETAILS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const userSalaryStructure = sequelize_db.define(
  "user_salary_structure",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    basic: {
      type: DataTypes.INTEGER,
    },
    hra: {
      type: DataTypes.INTEGER,
    },
    conveyance: {
      type: DataTypes.INTEGER,
    },
    special_allowance: {
      type: DataTypes.INTEGER,
    },
    gross_monthly_amount: {
      type: DataTypes.INTEGER,
    },
    bonus: {
      type: DataTypes.INTEGER,
    },
    performance_allowance: {
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
    ctc_per_month: {
      type: DataTypes.INTEGER,
    },
    ctc_per_annum: {
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
module.exports = userSalaryStructure;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
