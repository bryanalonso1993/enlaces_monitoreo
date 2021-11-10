const express = require('express');
const router = express.Router();

/**
 * Middlewares
 */
const { validateSchema, validateToken } = require('../middlewares');

/**
 * controllers
 */
const { processDataAuth, controllerApiPM, controllerDb, controllerApiOPM } = require('../controllers');


module.exports = function () {
    /** Metodos POST */
    router.post('/authentication', processDataAuth);
    router.post('/devices', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaObjectDevices, controllerDb.insertDevices);
    router.post('/interfaces', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaUpdateInterface, controllerDb.insertOrUpdateInterface);
    /** Metodos GET */
    // metodos para consulta a la base de datos
    router.get('/interfaces', validateSchema.validateSchemaToken, validateToken, validateSchema.validateDeviceName, controllerDb.getInterface);
    router.get('/devices', validateSchema.validateSchemaToken, validateToken, controllerDb.getDeviceAll);
    router.get('/devicesid', validateSchema.validateSchemaToken, validateToken, validateSchema.validateDeviceName, controllerDb.getDeviceId);
    // metricas a traer
    router.get('/query/api', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaQueryDb, controllerApiPM.getMetricApiPM);
    router.get('/query/db', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaQueryDb, controllerDb.getMetricDbInterface);
    // metodos de consulta del api
    // OPM
    router.get('/opm/devices', controllerApiOPM.getDevicesApi);
    router.get('/opm/interfaces', controllerApiOPM.getInterfacesApi);
    // PM
    router.get('/pm/devices', controllerApiPM.getDevicesApi);
    router.get('/pm/interfaces', controllerApiPM.getInterfacesApi);
    /** Metodos DELETE */
    router.delete('/devices', validateSchema.validateSchemaToken, validateToken, validateSchema.validateDeviceName, controllerDb.deleteDevices);
    router.delete('/interfaces', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaDropInterface, controllerDb.deleteInterface);
    return router;
}
