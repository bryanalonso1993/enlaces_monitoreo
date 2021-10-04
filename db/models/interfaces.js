const connection = require('../connection');
const { DataTypes } = require('sequelize');

const interfaces = connection.define('interfaces', {
    deviceName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    interface: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    uid:{
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
},{
    freezeTableName: true
})

module.exports = interfaces;
