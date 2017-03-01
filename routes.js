// let ErrorHandler = require('../handlers/errorHandler').errorHandler;
const bodyParser = require('body-parser');
const errorHandler = require("./handlers/errorHandler.js").errorHandler;
const processDataHandler = require("./handlers/dataHandler.js");
const eUtilsHandler = require('./handlers/eUtilsHandler.js');
const fileHandler = require('./handlers/fileDownloadHandler.js');
const cors = require("cors");

// serve static file contents

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

    app.post('/search-ncbi', eUtilsHandler);

    app.post('/downlaodFile', fileHandler.createCSV);

    app.get('/downlaodFile', fileHandler.downloadFile);

}

module.exports = exports = routes;
