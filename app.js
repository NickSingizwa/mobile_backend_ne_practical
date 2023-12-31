//setting up server
const express = require('express');;
const cors = require("cors");
const fileUpload = require("express-fileupload")
const swaggerUi = require("swagger-ui-express");
const cookieParser = require('cookie-parser');
const swaggerDocs = require("./swagger.json")
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {
    dbConnection
} = require('./models/db');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'))
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
const helmet = require('helmet');
app.use(helmet());
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
const xss = require('xss-clean');
app.use(xss());
const hpp = require('hpp');
const {
    Log
} = require('./models/logs/logs.model');
const {
    router
} = require('./routes/purchase.routes');
app.use(hpp());
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs, false, {
    docExpansion: "none"
}))

//storing logs
app.use(async (req, res, next) => {
    const {
        method,
        path
    } = req;
    const start = Date.now();

    res.on('finish', () => {
        const {
            statusCode
        } = res;
        const responseTime = Date.now() - start;

        const log = new Log({
            method,
            path,
            statusCode,
            responseTime
        });

        log.save()
            .catch((err) => {
                console.error('Error saving log:', err);
            });
    });

    next();
});
//routes
app.use("/", router);
//getting logs
app.get('/logs', async (req, res) => {
    try {
        const logs = await Log.find();
        res.json(logs);
    } catch (error) {
        console.error('Error retrieving logs:', error);
        res.status(500).json({
            message: 'Error retrieving logs'
        });
    }
});
const port = process.env.PORT || 5000;
//connecting to database
dbConnection();
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});