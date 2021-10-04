const connection = require('../connection');
const { DataTypes } = require('sequelize');

const categories = connection.define('categories', {
    deviceName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    categoryName: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
},{
    freezeTableName: true
})

module.exports = categories;
