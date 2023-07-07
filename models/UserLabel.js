//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const { Sequelize, DataTypes } = require("sequelize");
const sequelize_db = require("../config/mysqlORM");


const UserLabel = sequelize_db.define(
    'user_labels',{
    id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    user_id: {
            type: DataTypes.INTEGER,
        },
    name:{
        type: DataTypes.INTEGER,
    },
    created_at:{
        type:DataTypes.INTEGER
    },
    updated_at:{
        type: DataTypes.INTEGER
    }
    


})