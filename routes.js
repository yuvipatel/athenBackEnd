// let ErrorHandler = require('../handlers/errorHandler').errorHandler;
let bodyParser = require('body-parser');
let errorHandler = require("./handlers/errorHandler.js").errorHandler;
let processDataHandler = require("./handlers/dataHandler.js");

function routes(app) {
    'use strict';

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(bodyParser.json());

    app.use(errorHandler);

    app.post('/processData', processDataHandler);
}


module.exports = exports = routes;


