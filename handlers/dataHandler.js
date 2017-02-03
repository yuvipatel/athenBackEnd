const exec = require('child_process').exec;
const csv = require('csv-tools');
const fs = require("fs");
const promisify = require("es6-promisify");
let Q = require('q');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

let csvInputDir = "../csvData/in/";
let csvOutputDir = "../csvData/out/";

function processData(req, res, next) {
    let jsonData = req.body || {};

    let csvInputFile = 'csvData/in/sample.csv';
    let csvOutFile = 'csvData/out/sampleEdited.csv';

    // convert json to csv -- done
    let csvData = csv.fromJSON(jsonData);

    writeFile(csvInputFile, csvData)
        .then(executeRScript)
        .then(sendRes)
        .then(function(dataObj) {
            res.send(200, dataObj.resObj);
        })
        .catch(function (err) {
            console.error("Yikes!", err);
        });

    // execute r command on file
    // send output csv file from r command as response.

    function executeRScript(dataObj) {
        'use strict';

        let deferred = Q.defer();
        let rCommand = 'Rscript R/csvUtil.r ' + csvInputFile + ' ' + csvOutFile;

        exec(rCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                deferred.reject(stderr);
                // res.send('Hello World! Error');
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            // res.send('Hello World!');
            deferred.resolve(dataObj);
        });

        return deferred.promise;
    }


    function sendRes(dataObj) {
        'use strict';

        let deferred = Q.defer();
        dataObj = dataObj || {};

        csv.fileToJSON(csvOutFile, function(data){
                console.log(data);
                dataObj.resObj = data;
                deferred.resolve(dataObj);
            });

        return deferred.promise;
    }



}



module.exports = exports = processData;