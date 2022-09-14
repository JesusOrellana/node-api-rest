const express = require('express')
const cors = require('cors');
const db = require("../database/config");
const path = require("path");
const hbs = require('hbs');
var bodyParser = require('body-parser');

const https = require('https');
const http = require('http');
const fs = require('fs');
class Server {

    constructor( path ) {
        
        /* this.init = init; */
        this.app = express();
        this.port = process.env.PORT;
        this.path = path;
        //Conexion BBDD
        this.connectDB();
        //Middlewares
        this.middlewares();
        //Rutas Servidor
        this.route = require('../routes/routes.json');
        this.routes();
        
    }

    async connectDB() {
        db.sequelize.sync();
    }

    middlewares() {
        this.app.set('view engine', 'hbs');
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, "./public")));
    }

    routes() {

        if (process.env.NODE_ENV_QA  == 'true') {
            this.app.use((req, res, next) => {
                console.log(`https://${req.headers.host}${req.url}`);
                if (req.secure) next(); else res.redirect(`https://${req.headers.host}${req.url}`);
            });
        }
        //Endpoints api
        this.app.use(this.route.routes.api.v1.user , require('../routes/v1/users'));
        this.app.use(this.route.routes.api.v1.auth , require('../routes/v1/auth'));
        this.app.use(this.route.routes.api.v1.role , require('../routes/v1/roles'));

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en ambiente ${process.env.NODE_ENV} en el puerto ${this.port}`);
        })
    }
}

module.exports = Server;