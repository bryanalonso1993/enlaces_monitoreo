const { request, response } = require('express');
const { endpoints } = require('../../helpers');
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
            let nameDevices = [];
            for ( const { Name, PrimaryIPAddress } of datasets) {
                nameDevices = [...nameDevices, { Name, PrimaryIPAddress }]
            }
            res.status(200).json({ data: nameDevices })
        })
        .catch(e => {
            res.status(500).json({error: `${e}`})
        })
}

exports.getIntefacesApi = async (req=request, res=response) => {
    const { DeviceName } = req.query;
    await axios.get( endpoints.listInterfaces(DeviceName) , opts)
        .then( response => {
            const datasets = response.data.d.results;
            let nameInterfaces = [];
            for (const { DisplayName, device: { Name } } of datasets) {
                nameInterfaces = [...nameInterfaces, { DisplayName, Name }];
            }
            res.status(200).json({ data: nameInterfaces });
        })
        .catch(e => {
            res.status(500).json({ error : `${e}`});
        })
}

exports.getMetricApiPM = async (req=request, res=response) => {
    const dataset = req.body;
    const { deviceName , interfaces } = dataset[0];
    await axios.get( endpoints.metricPMInterface(deviceName, interfaces[0]), opts)
        .then( response => {
            const datasets = response.data.d.results[0];
            let metricInterface = [];
            for ( const { Timestamp, im_BitsPerSecondIn } of datasets.portmfs.results ) {
                metricInterface = [...metricInterface, { DeviceName: datasets?.device?.Name, Timestamp, im_BitsPerSecondIn }];
            }
            res.status(200).json({ data: metricInterface });
        })
        .catch(e => {
            res.status(500).json({ error: `${e}`});
        })
}
