/**
 * models Sequelize ORM
 */

const { devices, interfaces, categories, thresholds, views } = require('../db/models');

/**
 *  Bulk Data process : ORM Sequelize
 *  https://sequelize.org/master/class/lib/model.js~Model.html#static-method-bulkCreate
 *
 * @param {*} data : Array de datos
 * @param {*} type : tipo de modelo al cual voy a realizar en insert de los datos
 */
const logger = require('../config/logger');

const bulkCreateData = async function ( data, type ) {
    logger.log({ level:'info', message: `type: Bulk, message: data in model: [${type}] nro registros:[${data.length}]`});
    if (type === "registerdevices"){
        await devices.bulkCreate(data);
    }else if (type === "registerinterfaces"){
        await interfaces.bulkCreate(data);
    }else if (type === "registercategories"){
        await categories.bulkCreate(data);
    }else if (type === "registerthresholds"){
        await thresholds.bulkCreate(data);
    }else {
        return "Undefined Bulk Data";
    }
}

module.exports = bulkCreateData;
