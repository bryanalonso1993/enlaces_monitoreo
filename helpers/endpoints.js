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
    },
    listDevicesOpManager: function (source) {
        switch (source) {
            case source === 'cmts':
                return `http://${process.env.API_IP_OPM_FIJA}:${process.env.API_PORT_FIJA}/api/json/device/listDevices?apiKey=${process.env.API_OPM_TOKEN_FIJA}`;
            case source === 'core':
                return `http://${process.env.API_IP_OPM_CORE}:${process.env.API_PORT_CORE}/api/json/device/listDevices?apiKey=${process.env.API_OPM_TOKEN_CORE}`;
            case source === 'rcsr':
                return `http://${process.env.API_IP_OPM_RCSR}:${process.env.API_PORT_RCSR}/api/json/device/listDevices?apiKey=${process.env.API_OPM_TOKEN_RCSR}`;
            default:
                return false;
        }
    },
    listInterfacesOpManager: function (source, DeviceName) {
        switch (source) {
            case source === 'cmts':
                return `http://${process.env.API_IP_OPM_FIJA}:${process.env.API_PORT_FIJA}/api/json/device/getInterfaces?apiKey=${process.env.API_OPM_TOKEN_FIJA}&name=${DeviceName}`;
            case source === 'core':
                return `http://${process.env.API_IP_OPM_CORE}:${process.env.API_PORT_CORE}/api/json/device/getInterfaces?apiKey=${process.env.API_OPM_TOKEN_CORE}&name=${DeviceName}`;
            case source === 'rcsr':
                return `http://${process.env.API_IP_OPM_RCSR}:${process.env.API_PORT_RCSR}/api/json/device/getInterfaces?apiKey=${process.env.API_OPM_TOKEN_RCSR}&name=${DeviceName}`;
            default:
                return false;
        }
    },
    exportMetricOpManagerInterface: function (source, ifIndex){
        switch (source) {
            case source === 'cmts':
                return `http://${process.env.API_IP_OPM_FIJA}:${process.env.API_PORT_FIJA}/api/json/device/getInterfaceGraphs?apiKey=${process.env.API_OPM_TOKEN_FIJA}&name=${DeviceName}`;
            case source === 'core':
                return `http://${process.env.API_IP_OPM_CORE}:${process.env.API_PORT_CORE}/api/json/device/getInterfaceGraphs?apiKey=${process.env.API_OPM_TOKEN_CORE}&name=${DeviceName}`;
            case source === 'rcsr':
                return `http://${process.env.API_IP_OPM_RCSR}:${process.env.API_PORT_RCSR}/api/json/device/getInterfaceGraphs?apiKey=${process.env.API_OPM_TOKEN_RCSR}&interfaceName=${ifIndex}&graphName=traffic&period=Today`;
            default:
                return false;
        }
    }
}

module.exports = endpoints;
