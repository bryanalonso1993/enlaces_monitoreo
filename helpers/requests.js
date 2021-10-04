require('../config/config');
const axios = require('axios').default;
/**
 * Parametros para el api configurar
 */
const encodedBase64 = Buffer.from(`${process.env.APIUSRPM}:${process.env.APIPWDPM}`).toString('base64');
const authorization = `Basic ${encodedBase64}`;
const opts = { withCredentials: true, headers: {"Accept":"application/json", "Content-Type":"application/json", "Authorization": authorization} };


const typeEndpoint = async (method, endpoint) => {
    switch (method.toLowerCase()) {
        case 'get':
            return await axios.get(endpoint, opts);
        case 'post':
            return await axios.post(endpoint, opts);
        default:
            return await axios.get(endpoint, opts);
    }
}

module.exports = typeEndpoint;
