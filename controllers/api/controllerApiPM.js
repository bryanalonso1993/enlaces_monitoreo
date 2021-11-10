const { request, response } = require('express');

/**
 * Ekastic APM Errores
 */
const { captureErrors, endpoints } = require('../../helpers');
const eventDetailLog = 'APIPMRequest';

/**
 * API
*/
const axios = require('axios').default;
const encodedBase64 = Buffer.from(`${process.env.API_USR_PM}:${process.env.API_PWD_PM}`).toString('base64');
const authorization = `Basic ${encodedBase64}`;
const opts = { withCredentials: true, headers: {"Accept":"application/json", "Content-Type":"application/json", "Authorization": authorization}, timeout: 120000 };


exports.getDevicesApi = async (req=request, res=response) => {
    await axios.get( endpoints.listDevices() , opts)
        .then( response => {
            const datasets = response.data.d.results;
            let data = [];
            for ( const { Name, PrimaryIPAddress } of datasets) {
                data = [...data, {
                    DeviceName:Name,
                    PrimaryIpAddress:PrimaryIPAddress }]
            }
            res.status(200).json({ data });
        })
        .catch(e => {
            captureErrors(eventDetailLog, `Error request Api Get Devices ${e}`);
            res.status(500).json({ error: `${e}` })
        })
}

exports.getIntefacesApi = async (req=request, res=response) => {
    const { DeviceName } = req.query;
    await axios.get( endpoints.listInterfaces(DeviceName) , opts)
        .then( response => {
            const datasets = response.data.d.results;
            let data = [];
            for (const { DisplayName, device: { Name } } of datasets) {
                data = [...data, {
                    DisplayName: DisplayName,
                    Name: Name }]
            }
            res.status(200).json({ data });
        })
        .catch(e => {
            captureErrors(eventDetailLog, `Error request Api Get Interfaces ${e}`);
            res.status(500).json({ error : `${e}`});
        })
}

exports.getMetricApiPM = async (req=request, res=response) => {
    const dataset = req.body;
    const { deviceName , interfaces } = dataset[0];
    await axios.get( endpoints.metricPMInterface(deviceName, interfaces[0]), opts)
        .then( response => {
            const datasets = response.data.d.results[0];
            let data = [];
            for ( const { Timestamp, im_BitsPerSecondIn } of datasets.portmfs.results ) {
                data = [...data, {
                    DeviceName: datasets?.device?.Name,
                    Timestamp: Timestamp,
                    im_BitsPerSecondIn: im_BitsPerSecondIn }]
            }
            res.status(200).json({ data });
        })
        .catch(e => {
            res.status(500).json({ error: `${e}`});
        })
}
