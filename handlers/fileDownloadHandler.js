const json2csv = require("json2csv");
const fs = require('fs');
const promisify = require("es6-promisify");
const Q = require('q');

const writeFile = promisify(fs.writeFile);

/**
 * Converts json to csv and downloads it
 */
function downloadCSV(req, res, next) {

    const jsonData = req.body;
    const fileName = `csvData/out/taggedCSV_${Date.now()}.csv`;

    // convert to csv
    let csvData = json2csv({ data: jsonData });

    console.log('Converted to CSV!');

    // store in file
    writeFile(fileName, csvData)
        .then(() => {
            // download file
            res.download(fileName);
            console.log('File Downloaded')
        })
        // .then((fileName) => {
        //     // delete file
        //     setTimeout((fileName) => {
        //         fs.unLinkSync(fileName);
        //     }, 600000)
        // })
        .catch((err) => {
        	console.log('Error downloading file!!', err);
        	res.status(400).send('Failed to download file!!');
        });


    // function downloadFile() {
    // 	let deferred = Q.defer();
    // }
}

module.exports = downloadCSV;
