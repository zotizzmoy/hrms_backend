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

sequelize_db.sync({ force: false }).then(() => {
  console.log('');
}).catch((error) => {
  console.error('Error syncing models:', error);
});
module.exports = Holiday;