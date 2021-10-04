// PORT APLICATION
process.env.PORT =  process.env.PORT || 7070;

// endpoint apm - server
//process.env.APMSERVER = "http://10.95.164.83:8200";
process.env.APMSERVER = "http://192.168.0.97:8200";

// api credentials
process.env.USERAPI = "nevermore";
process.env.PASSAPI = "$@T3st123@$";

// secret seed
process.env.SEED = "$#S3credSeedClaro2021#$";

// parameters database mariadb
//process.env.HOSTDB = "172.19.216.110";
process.env.HOSTDB = "127.0.0.1";
process.env.ENGINEDB = "mariadb";
process.env.PORTDB = 3306;
process.env.DB = "semaforos";
process.env.USERDB = "node";
process.env.PASSDB = "node";

// parameters api pm
process.env.APIIPADDR = "172.19.216.20";
process.env.APIUSRPM = "usrpmauth";
process.env.APIPWDPM = "Pepito123";
process.env.APIPORTPM = 8581;

// endpoing grafana
process.env.GRAFANASERVER = "http://10.95.164.101";
