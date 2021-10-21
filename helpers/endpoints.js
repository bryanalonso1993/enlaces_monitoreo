const intervalMetricApiPM = "900s";

const endpoints = {
    listDevices: function () {
        return `http://${process.env.API_IP_ADDR}:${process.env.API_PORT_PM}/odata/api/devices?$top=20000&$skip=0&$format=json`;
    },
    listInterfaces: function (DeviceName) {
        return `http://${process.env.API_IP_ADDR}:${process.env.API_PORT_PM}/odata/api/interfaces?&resolution=RATE&timeout=120&$format=json&$top=500&$skip=0&top=100&$expand=device,portmfs&$select=device/Name,device/PrimaryIPAddress,DisplayName,IPAddresses,Name&$filter=((device/Name eq '${DeviceName}'))`;
    },
    metricPMInterface: function (DeviceName, interface) {
        return `http://${process.env.API_IP_ADDR}:${process.env.API_PORT_PM}/odata/api/interfaces?&resolution=RATE&timeout=120&$format=json&$top=500&$skip=0&top=100&period=${intervalMetricApiPM}&$expand=device,portmfs&$select=device/Name,device/PrimaryIPAddress,DisplayName,IPAddresses,portmfs/Timestamp,portmfs/im_BitsPerSecondIn,portmfs/im_BitsPerSecondOut&$filter=((device/Name eq '${DeviceName}') and (DisplayName eq '${interface}'))`;
    }
}

module.exports = endpoints;
