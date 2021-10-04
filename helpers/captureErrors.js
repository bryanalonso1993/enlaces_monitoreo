const logger = require('../config/logger');
const apm = require('elastic-apm-node');

const captureErrors = (type, e) => {
    logger.log({level:'error',message: `type: ${type} , error:${e}`});
    apm.captureError(`type: ${type}, error: ${e}`);
}

module.exports = captureErrors;
