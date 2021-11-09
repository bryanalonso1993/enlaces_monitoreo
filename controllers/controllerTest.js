const { request, response } = require('express');
const axios = require('axios').default;

function endpointPerId(id){ return axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`) }

function spreadControllerAxiosDevices (req=request, res=response) {
    const datasets = req.body;
    let listEndpoints = new Array();
    for ( const { id } of datasets ){ listEndpoints = [...listEndpoints, endpointPerId(id)] }
    Promise.allSettled(listEndpoints)
        .then( results => {
            let values = [];
            for ( let index=0;index<results.length; index++){
                if ( results[index].status === 'rejected') {
                    values = [ ...values , {
                        estado: results[index]?.status,
                        messageText: results[index]?.response.statusText,
                        datasets: {} } ];
                } else {
                    values = [ ...values, {
                        estado: results[index]?.value?.status,
                        messageText: results[index]?.value?.statusText,
                        datasets: results[index]?.value?.data } ];
                }
            }
            res.json( {data: values} );
        });
}

function processControllerDevices (req=request, res=response) {
    const { source } = req.params;
    const { method } = req.query;
    const datasets = req.body;
    let listEndpoints = [];
    if ( source === 'pm' && method === 'listNode' ) {
        for ( const { id } of datasets ){ listEndpoints = [...listEndpoints, endpointPerId(id)]; }
        axios.all(listEndpoints)
            .then( axios.spread( (...responses) => {
                let data = [];
                for (let index=0;index<responses.length;index++){ data = [...data, responses[index].data]; }
                res.status(200).json({data});
            }))
            .catch(e => { return res.status(500).json({error: { message: e.message, url: e.config.url } }) });
    }else if ( source === 'pm' && method === 'listAllNodes'){
        return res.status(200).json({
            source,
            data: datasets
        })
    }
    else if ( source === 'opm' && method === 'listnodes' ){
        console.log(datasets);
        console.log(method);
        return res.status(200).json({
            source,
            data:datasets
        });
    }else{
        return res.status(500).json({
            error: ' Not found Method ... :"c'
        })
    }
}

//module.exports = processControllerDevices;
module.exports = spreadControllerAxiosDevices;