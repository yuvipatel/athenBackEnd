const eutils = require('ncbi-eutils');
const csvtojson = require('csvtojson');
const Q = require('q');

const alzheimerFilePath = `data/Alzheimers_search_result.csv`;
const tamoxifenFilePath = `data/Tamoxifen_search_result.csv`;

/**
 * Queries NCBI DB by using eUtils library
 */
function getSearchResult(req, res, next) {
    let org = req.body.org ? ' AND ' + req.body.org : '';
    let exp = req.body.exp ? ' AND ' + req.body.exp : '';
    let searchData = req.body.disease ? req.body.disease + org + exp :
        req.body.drug + org + exp;

    // Add GSE filter to query
    searchData += ` "gse"[Filter]`;

    // TODO - Need to remove following code. This is added to handle special case of Alzheimer and Tamoxifen 

    // Special case of Alzheimer
    if (req.body.disease && req.body.disease.toLowerCase().indexOf(`alzheimer`) > -1) {

        getJSONFromCSV(alzheimerFilePath)
            .then((jsonData) => {

                const alzheimerRes = {
                    type: 'fixedResponse',
                    queryFor: 'alzheimer',
                    data: jsonData
                };

                res.status(200).send(alzheimerRes);
            })
            .catch((err) => {
                console.log('Error', err);
                res.status(400).send('Error Processing Request!!');
            });

    } else if (req.body.drug && req.body.drug.toLowerCase().indexOf(`tamoxifen`) > -1) {

        getJSONFromCSV(tamoxifenFilePath)
            .then((jsonData) => {
                // special case for Tamoxifen
                const tamoxifenRes = {
                    type: 'fixedResponse',
                    queryFor: 'tamoxifen',
                    data: jsonData
                };

                res.status(200).send(tamoxifenRes);
            })
            .catch((err) => {
                console.log('Error', err);
                res.status(400).send('Error Processing Request!!');
            });

    } else {
        eutils.esearch({
                db: 'gds',
                term: searchData
            })
            .then((d) => {
                //supported eutil parameters can be added like this
                // d.retstart = 5;
                d.retmax = 50;
                return eutils.esummary(d);
            })
            .then((d) => {
                res.status(200).send(d);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send(`Failed to get results from NCBI-DB`);
            });
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

module.exports = getSearchResult;
