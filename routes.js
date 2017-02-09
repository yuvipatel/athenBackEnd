// let ErrorHandler = require('../handlers/errorHandler').errorHandler;
const bodyParser = require('body-parser');
const errorHandler = require("./handlers/errorHandler.js").errorHandler;
const processDataHandler = require("./handlers/dataHandler.js");
const eUtilsHandler = require('./handlers/eUtilsHandler.js');
const cors = require("cors");

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

    app.get('/search-ncbi', eUtilsHandler);

}

module.exports = exports = routes;
