// let ErrorHandler = require('../handlers/errorHandler').errorHandler;
let bodyParser = require('body-parser');
let errorHandler = require("./handlers/errorHandler.js").errorHandler;
let processDataHandler = require("./handlers/dataHandler.js");
let cors = require("cors");

function routes(app) {
    'use strict';

    app.use(cors());
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(bodyParser.json());

    app.use(errorHandler);

    app.post('/processData', processDataHandler);

}


module.exports = exports = routes;
