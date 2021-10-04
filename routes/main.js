const express = require('express');
const router = express.Router();

/**
 * Middlewares
 */
const { validateSchema, validateToken } = require('../middlewares');

/**
 * controllers
 */
const { processDataAuth, processDataMariaDb } = require('../controllers');

module.exports = function () {
    /** Metodos POST */
    router.post('/authentication', processDataAuth);
    router.post('/devices', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaObjectDevices, processDataMariaDb.insertDevices);
    router.post('/interfaces', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaInterface, processDataMariaDb.insertInterfaces);
    router.post('/thresholds', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaThresholds, processDataMariaDb.insertThreSholds);
    router.post('/viewdashboard', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaView, processDataMariaDb.insertView);
    /** Metodos GET */
    router.get('/interfaces', validateSchema.validateSchemaToken, validateToken, validateSchema.validateDeviceName, processDataMariaDb.getInterfaces);
    router.get('/devices', validateSchema.validateSchemaToken, validateToken, processDataMariaDb.getDevices);
    /** Metodos DELETE */
    router.delete('/devices', validateSchema.validateSchemaToken, validateToken, validateSchema.validateDeviceName, processDataMariaDb.deleteDevices);
    router.delete('/interfaces', validateSchema.validateSchemaToken, validateToken, validateSchema.validateSchemaInterface, processDataMariaDb.deleteInterfaces);
    return router;
}
