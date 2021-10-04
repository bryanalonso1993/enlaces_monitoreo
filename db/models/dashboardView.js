const connection = require('../connection');
const { DataTypes } = require('sequelize');

const dashboardView = connection.define('dashboardView', {
    endpoint: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    uid:{
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false
    }
},{
    freezeTableName: true
})

module.exports = dashboardView;
