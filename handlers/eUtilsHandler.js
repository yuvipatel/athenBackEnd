const eutils = require('./../ncbi-eutils/src/core-utils');

/**
 * Queries NCBI DB by using eUtils library
 */
function getSearchResult(req, res, next) {

    eutils.esearch({
            db: 'gds',
            term: 'chordoma'
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
