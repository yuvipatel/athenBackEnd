const json2csv = require("json2csv");
const fs = require('fs');
const promisify = require("es6-promisify");
const Q = require('q');

const writeFile = promisify(fs.writeFile);

/**
 * Object to be exposed publicly
 */
const fileDownloader = {
    createCSV: generateCSV,
    downloadFile: downloadFile
}

/**
 * Converts json to csv and downloads it
 */
function generateCSV(req, res, next) {
    const jsonData = req.body;
    const fileName = `csvData/out/taggedCSV_${Date.now()}.csv`;

    // convert to csv
    let csvData = json2csv({ data: jsonData });

    // store in file
    writeFile(fileName, csvData, 'binary')
        .then(() => {
            res.status(200).send({
                fileName: fileName
            });
        })
        .catch((err) => {
            console.log('Error downloading file!!', err);
            res.status(400).send('Failed to download file!!');
        });
}

/**
 * Download file passed in request name
 */
function downloadFile(req, res, next) {

    // console.log('Request', req.query);

    let filename = req.query.filename;
    let search = req.query.search;
    let type = req.query.type;

    res.download(filename, `GEOmAtik_${search}_${type}_${getDate()}.csv`, function(err) {
        if (err) {
            console.log('Error downloading file!!', err);
            res.status(400).send('Error downloading file!!')
        } else {
            fs.unlink(filename, (err) => {
                if (err) console.log('Error', err);
                console.log('File deleted!!');
            });
        }
    });
};

/**
 * Returns date for Indian Locale in ddmmyyyy format
 */
function getDate() {
	let today = new Date();

	let date = today.getDate();
	let month = today.getMonth() + 1;
	let year = today.getYear() + 1900;

    month = (month < 10) ? '0' + month : month;
	date = (date < 10) ? '0' + date : date;

    return `${month}${date}${year}`;
}

module.exports = fileDownloader;
