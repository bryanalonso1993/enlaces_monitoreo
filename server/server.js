require('../config/config');
const express = require('express');
const apm = require('elastic-apm-node');
const { captureErrors } = require('../helpers');
const logger = require('../config/logger');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
        this.apm();
        this.db();
    }
    apm(){
        apm.start({
            serverUrl: process.env.APMSERVER
        })
    }
    middlewares(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}));
    }
    db(){
        require('../db/models');
        const connection = require('../db/connection');
        connection.sync()
            .then( () => { logger.log({ level: 'info', message: 'Success Sync ORM Sequelize' }) })
            .catch( e => { captureErrors("System", `Error Sync ORM Sequelize ${e}`) });
    }
    routes(){
        this.app.use('/', require('../routes/main')());
    }
    listen(){
        this.app.listen(this.port, () => console.log(`App running on port ${this.port}`));
    }
}

module.exports = Server;
