/**
 * parametros de conexion a la base de datos
 */
const { Sequelize } = require('sequelize');
const logger = require('../config/logger');

/**
 * Errores
 */
const { captureErrors } = require('../helpers');

const sequelize = new Sequelize(process.env.DB, process.env.USER_DB, process.env.PASS_DB, {
    host: process.env.HOST_DB,
    dialect: process.env.ENGINE_DB,
    port: process.env.PORT_DB,
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
