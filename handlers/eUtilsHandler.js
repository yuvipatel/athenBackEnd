const eutils = require('ncbi-eutils');

const dummyAlzheimerResponse = require('./../data/alzheimerData.js');
const dummyTamoxifenResponse = require('./../data/tamoxifenData.js');

/**
 * Queries NCBI DB by using eUtils library
 */
function getSearchResult(req, res, next) {
    let org = req.body.org ? ' AND ' + req.body.org : '';
    let exp = req.body.exp ? ' AND ' + req.body.exp : '';
    let searchData = req.body.disease ? req.body.disease + org + exp :
        req.body.drug + org + exp;

    console.log('searchData for', searchData);

    // TODO - Need to remove following code. This is added to handle special case of Alzheimer and Tamoxifen 

    // Special case of Alzheimer
    if (req.body.disease && req.body.disease.toLowerCase().indexOf(`alzheimer`) > -1) {
        res.status(200).send(dummyAlzheimerResponse);
    } else if (req.body.drug && req.body.drug.toLowerCase().indexOf(`tamoxifen`) > -1) {
        // special case for Tamoxifen
        res.status(200).send(dummyTamoxifenResponse);
    } else {
        eutils.esearch({
                db: 'gds',
                term: searchData
            })
            .then((d) => {
                //supported eutil parameters can be added like this
                d.retstart = 5;
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

module.exports = getSearchResult;
