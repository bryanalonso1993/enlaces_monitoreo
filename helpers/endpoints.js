require('../config/config');

const endpoints = {
    'query_pm_interface': function (deviceName, interface) {
        return `http://${process.env.APIIPADDR}:${APIPORTPM}/odata/api/interfaces?$format=json&$top=500&$skip=0&top=100&period=600s&$expand=device,portmfs&$select=device/Name,device/PrimaryIPAddress,DisplayName,IPAddresses,portmfs/Timestamp,portmfs/im_BitsPerSecondIn,portmfs/im_BitsPerSecondOut&$filter=((device/Name eq '${deviceName}') and (DisplayName eq '${interface}'))`
    } 
}

module.exports = endpoints;
