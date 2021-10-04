/**
 * parametros de conexion a la base de datos
 */
require('../config/config');
const { Sequelize } = require('sequelize');
const logger = require('../config/logger');

/**
 * Errores
 */
const { captureErrors } = require('../helpers');

const sequelize = new Sequelize(process.env.DB, process.env.USERDB, process.env.PASSDB, {
    host: process.env.HOSTDB,
    dialect: process.env.ENGINEDB,
    port: process.env.PORTDB,
    timezone: 'America/Lima',
    define:{
        charset: 'utf8',
        collate: 'utf8_general_ci'
    }
});

sequelize.authenticate()
        .then( () => {
            logger.log({ level: 'info', message: 'Success Authentication ORM sequelize'});
        })
        .catch( e => {
            captureErrors("System",`Error Connect Database ${e}`);
        });

module.exports = sequelize;
