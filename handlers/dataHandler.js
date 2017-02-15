const exec = require('child_process').exec;
const csvtojson = require('csvtojson');
const json2csv = require("json2csv");
const fs = require("fs");
const promisify = require("es6-promisify");
let Q = require('q');

// tagged result set files
const alzheimerTaggedFile = `data/Alzheimers_finaloutput.csv`;
const tamoxifenTaggedFile = `data/Tamoxifen_finaloutput.csv`;

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

let csvInputDir = "../csvData/in/";
let csvOutputDir = "../csvData/out/";

function processData(req, res, next) {

    let jsonData = req.body || {};


    let csvInputFile = 'csvData/in/sample.csv';
    let csvOutFile = 'csvData/out/sampleEdited.csv';


    // Handling for fixed responses for alzhiemer and tamoxifen
    if (jsonData[0].type === 'fixedResult') {
        const filename = (jsonData[0].data === 'alzheimer') ? alzheimerTaggedFile : tamoxifenTaggedFile;

        getJSONFromCSV(filename)
            .then((resData) => {
                res.status(200).send(resData);
            })
            .catch((err) => {
                console.log('Error', err);
                res.status(400).send('Error Processing Request!!');
            });

    } else {
        // convert json to csv -- done
        let csvData = json2csv({ data: jsonData });

        writeFile(csvInputFile, csvData)
            .then(executeRScript)
            .then(sendRes)
            .then(function(dataObj) {
                // res.send(200, dataObj.resObj);
                res.status(200).send(dataObj.resObj);
            })
            .catch(function(err) {
                console.error("Yikes!", err);
            });
    }

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
        let jsonFromCsv = [];
        dataObj = dataObj || {};


        csvtojson()
            .fromFile(csvOutFile)
            .on('json', (jsonObj) => {
                // combine csv header row and csv line to a json object
                // jsonObj.a ==> 1 or 4
                jsonFromCsv.push(jsonObj);
            })
            .on('done', (error) => {
                dataObj.resObj = jsonFromCsv;
                deferred.resolve(dataObj);
            });



        return deferred.promise;
    }
}

/**
 * Returns JSON after reading content from CSV file stored 
 * locally and converting it to JSON
 */
function getJSONFromCSV(filename) {
    let deferred = Q.defer();
    let jsonFromCsv = [];

    csvtojson()
        .fromFile(filename)
        .on('json', (jsonObj) => {
            // combine csv header row and csv line to a json object
            // jsonObj.a ==> 1 or 4
            jsonFromCsv.push(jsonObj);
        })
        .on('done', (error) => {
            deferred.resolve(jsonFromCsv);
        });

    return deferred.promise;
}

module.exports = exports = processData;
