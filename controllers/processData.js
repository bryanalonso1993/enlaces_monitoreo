const { request, response } = require('express');
const { captureErrors, endpoints } = require('../helpers');
const logger = require('../config/logger');

require('../config/config');
/**
 * Parametros del API del PM
 */
const axios = require('axios').default;
const encodedBase64 = Buffer.from(`${process.env.APIUSRPM}:${process.env.APIPWDPM}`).toString('base64');
const authorization = `Basic ${encodedBase64}`;
const opts = { withCredentials: true, headers: {"Accept":"application/json", "Content-Type":"application/json", "Authorization": authorization} };

/**
 * DB
 */
const connection = require('../db/connection');
const intervalSecondTimeQuery = 600;
const queryString = (deviceName, interfaces) => {
    let query = `select A.device_name,A.interface,A.timestamp_polling,A.BitsPerSecondIn from (select device_name,interface,
    timestamp_polling,BitsPerSecondIn from ${deviceName} where timestamp_polling between UNIX_TIMESTAMP(CURRENT_TIMESTAMP() - interval ${intervalSecondTimeQuery} second)
    AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP())) as A where A.interface in (${interfaces})`;
    return query;
}

function processInterfaces (storage) {
    let interfaceString = "";
    for (let index=0; index<storage.length - 1; index++) {
        interfaceString += `"${storage[index]}",`;
    }
    interfaceString += `"${storage[storage.length - 1]}"`;
    return interfaceString;
}

function processAllQueries(db) {
    let fullQuery = "";
    for (let index=0;index<db.length;index++){
        let { deviceName, interfaces } = db[index];
        fullQuery += queryString(deviceName, processInterfaces(interfaces)).concat(" UNION ALL ");
    }
    fullQuery += queryString(db[db.length - 1].deviceName, db[db.length - 1].interfaces);
    return fullQuery;
}

/**
 * API
 */


// metodo de consulta : http://127.0.0.1:7070/:method/?device=&interface=
const getDataServer = (req=request, res=response) => {
    const { method } = req.params;
    const data = req.body;
    switch (method.toLowerCase()) {
        case 'bd':
            connection.query();
            break;
        case 'api':
            res.send('OK');
            break;
        default:
            break;
    }
}

module.exports = getDataServer;
