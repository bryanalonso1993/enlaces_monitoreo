const connection = require('../connection');
const { DataTypes } = require('sequelize');

const devices = connection.define('devices', {
  deviceName: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  ipAddress: {
    type: DataTypes.STRING(16),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  monitoring: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  enable: {
    type: DataTypes.SMALLINT(1),
    allowNull: false,
    defaultValue:0
  }
},{
  freezeTableName: true
})

module.exports = devices;
