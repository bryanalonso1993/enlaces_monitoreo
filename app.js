/**
 * importando el objeto
 */
const Server = require('./server/server');
/**
 * instanciar el servidor
 */
const server = new Server();

// escuchar por el puerto la aplicacion
server.listen();

// capturar errores logs
/**
 *  var err = new Error('Ups, something broke!')
 * apm.captureError(err)
 */