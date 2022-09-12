const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const dbConnection = require('../database/config');
const fileUpload = require('express-fileupload');
const https = require('https');
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
        await dbConnection();
    }

    middlewares() {

        this.app.set('view engine', 'hbs');
        this.app.use(cookieParser());
        this.app.use(session({
            secret: 'keyboard cat',
            resave: true,
            saveUninitialized: true
        }));

        /* if (process.env.NODE_ENV_PROD  == 'true') {

            var whitelist = ['https://axionate.io']
            var corsOptions = {
                origin: function (origin, callback) {
                if (whitelist.indexOf(origin) !== -1) {
                    callback(null, true)
                } else {
                    callback(console.log('sin autorización'))
                }
                }
            }
        } */
        
        this.app.use( cors(/* corsOptions */) );
        this.app.use( express.json() );
        this.app.use( bodyParser.urlencoded({ extended: true }) );
        this.app.use( bodyParser.json() );
        this.app.use(fileUpload());
           
    }

    routes() {

        if (process.env.NODE_ENV_PROD  == 'true') {
            this.app.use((req, res, next) => {
                console.log(`https://${req.headers.host}${req.url}`);
                if (req.secure) next(); else res.redirect(`https://${req.headers.host}${req.url}`);
            });
        }
        //Endpoints api
        this.app.use('/' , require('../routes/main'));
        /* this.app.use(this.route.routes.api.v1.auth, require('../routes/api/v1/auth')); */
    }

    listen() {

        if (process.env.NODE_ENV_PROD  == 'true') {
            const httpsServerOptions = {
                key: fs.readFileSync(process.env.KEY_PATH),
                cert: fs.readFileSync(process.env.CERT_PATH),
            };
            // Servidor HTTPS
            const serverHttps = https.createServer(httpsServerOptions, this.app);
            serverHttps.listen(process.env.HTTPS_PORT, process.env.IP);
            console.log(`Servidor corriendo en ambiente ${process.env.NODE_ENV} en el puerto ${process.env.HTTPS_PORT}`);
        }
        else{
            this.app.listen(this.port, () => {
                console.log(`Servidor corriendo en ambiente ${process.env.NODE_ENV} en el puerto ${this.port}`);
            })
        }
    }
}

module.exports = Server;