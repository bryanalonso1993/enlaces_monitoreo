const processDataAuth = require('./processDataAuth');
const controllerApiPM = require('./api/controllerApiPM');
const controllerApiOPM = require('./api/controllerApiOPM');
const controllerDb = require('./database/controllerDb');

module.exports = {
    processDataAuth,
    controllerApiPM,
    controllerDb,
    controllerApiOPM
}
