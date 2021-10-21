const connection = require('../connection');
const { DataTypes } = require('sequelize');

const interface = connection.define('interfaces', {
    deviceName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    interface: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    max: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    min:{
        type: DataTypes.BIGINT,
        allowNull: false
    },
    endpoint:{
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    uid:{
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
},{
    freezeTableName: true
})

module.exports = interface;
