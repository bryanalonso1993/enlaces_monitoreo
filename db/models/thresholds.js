const connection = require('../connection');
const { DataTypes } = require('sequelize');

const thresholds = connection.define('thresholds', {
    uid:{
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    max:{
        type: DataTypes.BIGINT,
        allowNull: false
    },
    min:{
        type: DataTypes.BIGINT,
        allowNull: false
    }
},{
    freezeTableName: true
})

module.exports = thresholds;
