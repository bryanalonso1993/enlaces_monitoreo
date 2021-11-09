const processDataAuth = require('./processDataAuth');
const controllerApiPM = require('./api/controllerApiPM');
const controllerDb = require('./database/controllerDb');
const controllerTest = require('./controllerTest');

module.exports = {
    processDataAuth,
    controllerApiPM,
    controllerDb,
    controllerTest
}
