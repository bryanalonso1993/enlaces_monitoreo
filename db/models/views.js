const connection = require('../connection');
const { DataTypes } = require('sequelize');

const dashboardView = connection.define('dashboardview', {
    endpoint: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    uid:{
        type: DataTypes.STRING(50),
        allowNull: false
    }
},{
    freezeTableName: true
})

module.exports = dashboardView;
