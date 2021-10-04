const { request, response } = require('express');
/**
 * Errores
 */
const { captureErrors } = require('../helpers');

/**
 * Models
 */
const { devices, interfaces, thresholds, dashboardView } = require('../db/models')

/**
 * logs
 */
const logger = require('../config/logger');

/**
 * Logica devices
 */

exports.insertDevices = (req=request, res=response) => {
    let deviceList = req.body;
    devices.bulkCreate(deviceList, {
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

exports.deleteDevices = (req=request, res=response) => {
    let deviceList = req.body;
    let deviceListName = new Array();
    deviceList.map( el => {
        deviceListName = [...deviceListName, el?.deviceName];
    });
    devices.destroy({ where:{ deviceName: deviceListName } })
        .then( () => {
            logger.log({level:'info', message: `Success destroy deviceList ${JSON.stringify(deviceList)}`}) 
            res.status(200).json({ message: "Success destroy ", data: deviceList });
        } )
        .catch(e => {
            captureErrors("BulkProcess", `Error destroy list devices ${e}`);
            res.status(500).json({Error: e});
        })
}

exports.getDevices = (req=request, res=response) => {
    devices.findAll()
    .then( response => {
        res.status(200).json(response);
    })
    .catch( e => {
        captureErrors("GetProcess", `Error Get list devices ${e}`);
        res.status(500).json({Error: e});
    })
}

/**
 * logica para las interfaces
 */
exports.insertInterfaces = (req=request, res=response) => {
    const interfaceList = req.body;
    let newInterfaceListWithUid = new Array();
    // Add uid
    interfaceList.forEach( element => {
        newInterfaceListWithUid = [...newInterfaceListWithUid, {deviceName: element.deviceName, interface: element.interface, uid: element.deviceName.concat("-",element.interface) }]
    });
    interfaces.bulkCreate(newInterfaceListWithUid, {
        updateOnDuplicate: ["deviceName", "interface", "uid"]
    })
    .then( () => {
        logger.log({ level: 'info', message: `Sucessfull Bulk data interface process ${JSON.stringify(interfaceList)}` });
        res.status(200).json({ message: "Success register interfaces" });
    })
    .catch( e => {
        captureErrors('BulkProcess', `Error Bulk Data Process Interfaces ${e}`);
        res.status(500).json({
            Error: e
        });
    });
}

exports.deleteInterfaces = (req=request, res=response) => {
    const interfaceList = req.body;
    if ( interfaceList.length !== 1 ){
        throw new Error('Not supported drop multiple interfaces');
    }
    interfaces.destroy({ where:{ deviceName: interfaceList[0].deviceName , interface: interfaceList[0].interface } })
    .then( () => {
        logger.log({level:'info', message: `Success destroy interfaces ${JSON.stringify(interfaceList)}`}) 
        res.status(200).json({ message: "Success destroy ", data: interfaceList });
    } )
    .catch(e => {
        captureErrors("BulkProcess", `Error destroy list interface ${e}`);
        res.status(500).json({Error: e});
    })
}

exports.getInterfaces = (req=request, res=response) => {
    const deviceNameList = req.body;
    let deviceList = new Array();
    deviceNameList.forEach( el => {
        deviceList = [...deviceList, el.deviceName];
    })
    interfaces.findAll({
        where: {
            deviceName: deviceList
        }
    })
    .then( response => {
        res.status(200).json(response);
    })
    .catch( e => {
        captureErrors("GetProcess", `Error Get list interfaces ${e}`);
        res.status(500).json({Error: e}); 
    })
}

/** insert thresholds */
exports.insertThreSholds = (req=request,res=response) => {
    const interfaceList= req.body;
    let thresholdsList = new Array();
    interfaceList.forEach( element => {
        thresholdsList = [...thresholdsList, { uid: element.deviceName.concat("-",element.interface), max: element.max, min: element.min }];
    });
    thresholds.bulkCreate(thresholdsList, {
        updateOnDuplicate: ["uid", "max", "min"]
    }).then( () => {
        logger.log({ level: 'info', message: `Success Update Thresholds`});
        res.status(200).json({ message: "Success update thresholds", data: interfaceList});
    })
    .catch( e => {
        captureErrors("BulkProcess", `Error update thresholds ${e}`)
        res.status(500).json({Error: e});
    });
}

/*  views */
exports.insertView = (req=request, res=response) => {
    const arrayList = req.body;
    let endpointUrl = new Array();
    arrayList.forEach( element => {
        endpointUrl = [...endpointUrl, { endpoint : element.endpoint, uid: element.deviceName.concat("-", element.interface)}]
    })
    dashboardView.bulkCreate(endpointUrl, {
        updateOnDuplicate: ["uid", "endpoint"]
    }).then( () => {
        logger.log({ level: 'info', message: `Success Update Thresholds`});
        res.status(200).json({ message: "Success update thresholds", data: endpointUrl});
    })
    .catch( e => {
        captureErrors("BulkProcess", `Error dashboardviews ${e}`);
        res.status(500).json({Error:e});
    })
}

