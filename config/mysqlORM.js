//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ssh = require('ssh2').Client;
const { Sequelize, DataTypes,Transaction } = require("sequelize");



const dotenv = require('dotenv').config();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ORM CONNECTION
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const sequelize_db = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});
try {
    sequelize_db.authenticate();
    console.log('CONNECTION HAS BEEN ESTABLISHED SUCCESSFULLY.');
} catch (error) {
    console.error('UNABLE TO CONNECT TO THE DATABASE', error);
}

sequelize_db.sync().then(() => {
    console.log('');
}).catch((error) => {
    console.log('Error creating table:', error);
});



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = sequelize_db;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++