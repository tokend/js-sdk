const isUndefined = require('lodash/isUndefined');
const delay = require('./delay').delay;

function waitForTX(testHelper, txhash) {
    return testHelper.server
        .transactions()
        .transaction(txhash)
        .call()
        .catch(err => {
            if (!isUndefined(err.response) && err.response.status === 404) {
                console.log("received 404 for tx - retrying");
                return delay(2000).then(() => waitForTX(testHelper, txhash));
            }
            throw err;
    });

}

function submitWithWait(testHelper, ops, source, signerKP) {
    return testHelper.server.submitOperationGroup(ops, source, signerKP).then(result => {
        return waitForTX(testHelper, result.hash).then(() => {
            return result;
        });
    });
}

module.exports = {
    waitForTX,
    submitWithWait
};
