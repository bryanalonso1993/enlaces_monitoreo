/**  TABLAS DE INVENTARIO de la APP
 *
 * Metodos para equipos:
 * insertDevices, deleteDevices, getDeviceAll, getDeviceId
 * Metodos para interfaces:
 * getInterface, InsertOrUpdateInterface, deleteInterface
 *
 */

const { request, response } = require('express');

/**
  * Helpers
  */
const { captureErrors } = require('../../helpers');

/**
  * Logs
  */
const logger = require('../../config/logger');


/**
 * Models ORM Sequelize
 */
const { devices, interface } = require('../../db/models');


/**
 * Logica devices
 */
exports.insertDevices = async (req=request, res=response) => {
    let deviceList = req.body;
    await devices.bulkCreate(deviceList, {
        updateOnDuplicate: ["ipAddress", "category", "monitoring", "enable"]
    }).then( () => {
        logger.log({ level: 'info', message: `Success Update devices`});
        res.status(200).json({ message: "Success update", data: deviceList});
    })
    .catch( e => {
        captureErrors("BulkProcess", `Error update device ${e}`)
        res.status(500).json({Error: e});
    });
}

exports.deleteDevices = async (req=request, res=response) => {
    let deviceList = req.body;
    let deviceListName = new Array();
    deviceList.map( el => {
        deviceListName = [...deviceListName, el?.deviceName];
    });
    await devices.destroy({ where:{ deviceName: deviceListName } })
        .then( () => {
            logger.log({level:'info', message: `Success destroy deviceList ${JSON.stringify(deviceList)}`}) 
            res.status(200).json({ message: "Success destroy ", data: deviceList });
        } )
        .catch(e => {
            captureErrors("BulkProcess", `Error destroy list devices ${e}`);
            res.status(500).json({Error: e});
        })
}

exports.getDeviceAll = async (req=request, res=response) => {
    await devices.findAll()
    .then( response => {
        res.status(200).json(response);
    })
    .catch( e => {
        captureErrors("GetProcess", `Error Get list devices ${e}`);
        res.status(500).json({Error: e});
    })
}

exports.getDeviceId = async (req=request, res=response) => {
    const data = req.body;
    let arrayDevices = new Array();
    for ( const { deviceName: name } of data){
        arrayDevices = [...arrayDevices, name]
    }
    await devices.findAll({
        where: {
            deviceName: arrayDevices
        }
    })
    .then( response => {
        res.status(200).json(response);
    })
    .catch( e => {
        captureErrors("GetProcess", `Error Get list devices ${e}`);
        res.status(500).json({Error: e});
    })
}

/**
 * Metodos para la interface
 */
function concatDeviceInterface (device, interface) {
    return device.concat('-', interface);
}

exports.getInterface = async (req=request, res=response) => {
    const deviceNameList = req.body;
    let arrayDevices = new Array();
    for ( const { deviceName } of deviceNameList ) {
        arrayDevices = [...arrayDevices, deviceName ];
    }
    await interface.findAll({
        where: { deviceName: arrayDevices }
    })
    .then( response => {
        res.status(200).json({
            data: response
        })
    })
    .catch( e => {
        captureErrors("GetProcess", `Error Get list interfaces ${e}`);
        res.status(500).json({
            error: e
        });
    } )
}

exports.insertOrUpdateInterface = async (req=request, res=response) => {
    const interfaceList = req.body;
    let newInterfaceListWithUid = new Array();
    for ( const { deviceName, interface, max, min, endpoint } of interfaceList){
        newInterfaceListWithUid = [...newInterfaceListWithUid, { deviceName, interface, max, min, endpoint, uid: concatDeviceInterface(deviceName, interface) }]
    }
    await interface.bulkCreate( newInterfaceListWithUid , { updateOnDuplicate: ["deviceName", "interface", "max", "min", "endpoint", "uid"] })
    .then( () => {
        logger.log({ level: 'info', message: `Sucessfull Bulk data interface process ${JSON.stringify(interfaceList)}` });
        res.status(200).json({ message: "Success register interfaces" , data: interfaceList});
    } )
    .catch( e => {
        captureErrors('BulkProcess', `Error Bulk Data Process Interfaces ${e}`);
        res.status(500).json({
            error: e
        });
    })
}

exports.deleteInterface = async (req=request, res=response) => {
    const interfaceList = req.body;
    let listUid = new Array();
    for (const { deviceName, interface } of interfaceList){
        listUid = [...listUid, concatDeviceInterface(deviceName, interface)];
    }
    await interface.destroy({ where: { uid: listUid } })
    .then( () => {
        logger.log({level:'info', message: `Success destroy interfaces ${JSON.stringify(interfaceList)}`});
        res.status(200).json({ message: "Success destroy ", data: interfaceList });
    })
    .catch( e => {
        captureErrors("BulkProcess", `Error destroy list interface ${e}`);
        res.status(500).json({
            error: e
        });
    });
}

/**
 * Sql Mostrar las metricas
 */
const connection = require('../../db/connection');

const intervalSecondTimeQuery = 900;
const queryString = (deviceName, interfaces) => {
    let query = `select A.counter,A.device_name,A.interface,A.timestamp_polling,A.BitsPerSecondIn from (select counter,device_name,interface,
    timestamp_polling,BitsPerSecondIn from enlaces.${deviceName} where timestamp_polling between UNIX_TIMESTAMP(CURRENT_TIMESTAMP() - interval ${intervalSecondTimeQuery} second)
    AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP())) as A where A.interface in (${interfaces})`;
    return query;
}

/**
 *  Funciones para concatenar
 */
function processInterfaces(storage) {
    let interfaceString = '';
    for (let index=0; index<storage.length - 1; index++) {
        interfaceString += `'${storage[index]}',`;
    }
    interfaceString += `'${storage[storage.length - 1]}'`;
    return interfaceString;
}

function processAllQueries(db) {
    let fullQuery = '';
    for (let index=0;index<db.length-1;index++){
        let { deviceName, interfaces } = db[index];
        fullQuery += queryString(deviceName, processInterfaces(interfaces)).concat(' UNION ALL ');
    }
    fullQuery += queryString(db[db.length - 1].deviceName, processInterfaces(db[db.length - 1].interfaces));
    return fullQuery;
}

// Metodo a exportar que trae la metrica por base de datos
exports.getMetricDbInterface = async (req=request, res=response) => {
    const dataset = req.body;
    const todoQuery = processAllQueries(dataset);
    await connection.query(todoQuery)
        .then( response => {
            logger.log({level:'info', message: `Success process query ${ todoQuery }`});
            res.status(200).json({ data: response[0] });
        })
        .catch( e => {
            captureErrors("dbquery", `Error query db: ${ e?.original?.text }`);
            res.status(500).send({ error: {source: e?.name, errorText: e?.original?.text , errorCode: e?.original?.code }});
        })
}
