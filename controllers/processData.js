const { request, response } = require('express');
const { captureErrors, endpoints } = require('../helpers');
const logger = require('../config/logger');

require('../config/config');
/**
 * DB
 */
const connection = require('../db/connection');
const intervalSecondTimeQuery = 600;
const queryString = (deviceName, interfaces) => {
    let query = `select A.device_name,A.interface,A.timestamp_polling,A.BitsPerSecondIn from (select device_name,interface,
    timestamp_polling,BitsPerSecondIn from enlaces.${deviceName} where timestamp_polling between UNIX_TIMESTAMP(CURRENT_TIMESTAMP() - interval ${intervalSecondTimeQuery} second)
    AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP())) as A where A.interface in (${interfaces})`;
    return query;
}

function processInterfaces (storage) {
    let interfaceString = '';
    for (let index=0; index<storage.length - 1; index++) {
        interfaceString += `'${storage[index]}',`;
    }
    interfaceString += `'${storage[storage.length - 1]}'`;
    return interfaceString;
}

function processAllQueries(db) {
    let fullQuery = '';
    for (let index=0;index<db.length;index++){
        let { deviceName, interfaces } = db[index];
        fullQuery += queryString(deviceName, processInterfaces(interfaces)).concat(' UNION ALL ');
    }
    fullQuery += queryString(db[db.length - 1].deviceName, processInterfaces(db[db.length - 1].interfaces));
    return fullQuery;
}

/**
 * API
 */
const axios = require('axios').default;
const encodedBase64 = Buffer.from(`${process.env.APIUSRPM}:${process.env.APIPWDPM}`).toString('base64');
const authorization = `Basic ${encodedBase64}`;
const opts = { withCredentials: true, headers: {"Accept":"application/json", "Content-Type":"application/json", "Authorization": authorization} };
const intervalTimeApiPM = "900s"
const queryEndpointPM = (deviceName, interface) => {
    return `http://${process.env.APIIPADDR}:${APIPORTPM}/odata/api/interfaces?$format=json&$top=500&$skip=0&top=100&period=${intervalTimeApiPM}&$expand=device,portmfs&$select=device/Name,device/PrimaryIPAddress,DisplayName,IPAddresses,portmfs/Timestamp,portmfs/im_BitsPerSecondIn,portmfs/im_BitsPerSecondOut&$filter=((device/Name eq '${deviceName}') and (DisplayName eq '${interface}'))`;
}


// metodo de consulta : http://127.0.0.1:7070/:method/
const getDataServer = async (req=request, res=response) => {
    const { method } = req.params;
    const data = req.body;
    switch (method.toLowerCase()) {
        case 'db':
            const totalQuery = processAllQueries(data);
            await connection.query(totalQuery)
                .then(response => {
                    logger.log({level:'info', message: `Success process query ${totalQuery}`});
                    res.status(200).json({ data: response});
                })
                .catch(e => {
                    captureErrors("dbquery", `Error query db: ${ e?.original?.text }`);
                    res.status(500).send({ error: {source: e?.name, errorText: e?.original?.text , errorCode: e?.original?.code }});
                })
            break;
        case 'api':
            await axios.get(queryEndpointPM(data[0].deviceName, data[0].interface), opts)
                .then(response => {
                    const data = response.d.results[0];
                    let storageData = new Array();
                    data.portmfs.results.forEach(element => {
                        storageData = [...storageData, {deviceName: data.device.Name, timestamp: element.Timestamp, BitsPerSecondIn: element.im_BitsPerSecondIn}];
                    });
                    res.status(200).json({
                        data: storageData
                    })
                })
                .catch(e => {
                    res.status(500).json({
                        error: e
                    })
                })
            break;
        default:
            break;
    }
}

module.exports = getDataServer;
