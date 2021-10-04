const Joi = require('joi');
const logger = require('../config/logger');
const { request, response } = require('express');

/**
 * Errores 
 */
const { captureErrors } = require('../helpers');

const typeValidation = 'validateSchema';

exports.validateSchemaToken = (req=request, res=response, next) => {
    const { token } = req.headers;
    const schema = Joi.object({
        token: Joi.string().required()
    });
    const { error } = schema.validate({ token });
    if (error) {
        captureErrors(typeValidation, `Error validate SchemaToken ${ error.details[0].message }`);
        throw res.status(500).json({ error: error });
    }
    next();
}

exports.validateSchemaObjectDevices = (req=request, res=response, next) => {
    const arrayDevices = req.body;
    const schema = Joi.object().keys({
        deviceName: Joi.string().required(),
        ipAddress: Joi.string().required(),
        category: Joi.string().required(),
        monitoring: Joi.string().required(),
        enable: Joi.number().required()
    });
    const schemaArray = Joi.array().items(schema);
    const { error } = schemaArray.validate(arrayDevices);
    if (error) {
        captureErrors(typeValidation, `Error validate SchemaDevices ${ error.details[0].message }`);
        throw res.status(500).json({ error: error });
    }
    next();
}
/*
    validacion para eliminar el device de la base de datos
*/
exports.validateDeviceName = (req=request, res=response, next) => {
    const arrayDeviceName = req.body;
    const schema = Joi.object().keys({
        deviceName: Joi.string().required()
    });
    const schemaArray = Joi.array().items(schema);
    const { error } = schemaArray.validate(arrayDeviceName);
    if ( error ) {
        captureErrors(typeValidation, `Error validate DeviceName ${ error.details[0].message }`);
        throw res.status(500).json({ error: error });
    }
    next();
}

exports.validateSchemaInterface = (req=request, res=response, next) => {
    const arrayInterfaceList  = req.body;
    const schema = Joi.object().keys({
        deviceName: Joi.string().required(),
        interface: Joi.string().required()
    });
    const schemaArray = Joi.array().items(schema);
    const { error } = schemaArray.validate(arrayInterfaceList);
    if ( error ) {
        captureErrors(typeValidation, `Error validate Interface list ${ error.details[0].message }`);
        throw res.status(500).json({ error: error });
    }
    next();
}


exports.validateSchemaThresholds = (req=request, res=response, next) => {
    const arrayInterfaceThresholds  = req.body;
    const schema = Joi.object().keys({
        deviceName: Joi.string().required(),
        interface: Joi.string().required(),
        max: Joi.number().required(),
        min: Joi.number().required()
    });
    const schemaArray = Joi.array().items(schema);
    const { error } = schemaArray.validate(arrayInterfaceThresholds);
    if ( error ) {
        captureErrors(typeValidation, `Error validate Interface list ${ error.details[0].message }`);
        throw res.status(500).json({ error: error });
    }
    next();
}

exports.validateSchemaView = (req=request, res=response, next) => {
    const arrayData = req.body;
    const schema = Joi.object().keys({
        deviceName: Joi.string().required(),
        interface: Joi.string().required(),
        endpoint: Joi.string().required()
    });
    const schemaArray = Joi.array().items(schema);
    const { error } = schemaArray.validate(arrayData);
    if (error) {
        captureErrors(typeValidation, `Error validate SchemaView ${ error.details[0].message }`);
        throw res.status(500).json({ error: error });
    }
    next();
}