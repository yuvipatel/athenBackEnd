const eutils = require('./../ncbi-eutils/src/core-utils');

/**
 * Queries NCBI DB by using eUtils library
 */
function getSearchResult(req, res, next) {
    var org =  req.body.org? ' AND ' + req.body.org : '';
    var exp = req.body.exp? ' AND ' + req.body.exp : '';
    var searchData = req.body.disease? req.body.disease + org  + exp :
        req.body.drugs +  + org  + exp;

    console.log('searchData for', searchData);

    eutils.esearch({
            db: 'gds',
            term: searchData
        })
        .then((d) => {
            //supported eutil parameters can be added like this
            d.retstart = 5;
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

module.exports = getSearchResult;
