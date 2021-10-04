const { request, response } = require('express');
/** Errores */
const { captureErrors } = require('../helpers')
const jwt = require('jsonwebtoken');
/**
 * export secret seed
 */
require('../config/config');

module.exports = (req=request, res=response, next) => {
    const { token } = req.headers;
    jwt.verify(token, process.env.SEED, function (err, decoded){
        if (err) {
            captureErrors("Token", `Error Validate Access Token ${err}`);
            //logger.log({ level: 'error', message: `Error Authentication ${err}`});
            throw res.status(400).json(`Error validate Authentication ${err}`);
        }
        next();
    });
}