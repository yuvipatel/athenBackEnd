let express = require('express');
let app = express();
let env = process.env;
const exec = require('child_process').exec;
let csvInputFile = 'csvData/in/sample.csv';
let csvOutFile = 'csvData/out/sampleEdited.csv';

let rCommand = 'Rscript R/csvUtil.r ' + csvInputFile + ' ' + csvOutFile;

app.get('/*', (req, res) => {
    exec(rCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            res.send('Hello World! Error');
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.send('Hello World!');
    });
});


app.listen(3000, () => {
    console.log('Example app listening on port 80!');
});