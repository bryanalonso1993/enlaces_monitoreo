const { request, response } = require('express');
const axios = require('axios').default;

/**
 * Errors
 */
const { captureErrors, endpoints } = require('../../helpers');
const eventDetailLog = 'APIOPMRequest';

// funcion con las consultas al endpoint
function httpRequestOpManager (url) { return axios.get(url) }

exports.getDevicesApi = (req=request, res=response) => {
    listDevices = [ httpRequestOpManager(endpoints.listDevicesOpManager('cmts')), httpRequestOpManager(endpoints.listDevicesOpManager('core')), httpRequestOpManager(endpoints.listDevicesOpManager('rcsr')) ];
    Promise.allSettled(listDevices)
        .then( results => {
            let values = [];
            for ( let index=0; index<results.length; index++){
                if (results[index].status === 'rejected') {
                    values = [...values, {
                        estado: results[index]?.status,
                        datasets: {} } ];
                }else {
                    values = [...values, {
                        estado: results[index]?.value?.status,
                        datasets: results[index]?.value?.statusText
                    }];
                }
            }
            res.status(200).json({ data: values });
        })
}

