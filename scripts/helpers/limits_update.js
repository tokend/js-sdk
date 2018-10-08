var reviewableRequestHelper = require('./review_request');
const StellarSdk = require('../../lib/index');

function createLimitsUpdateRequest(testHelper, source, details, requestID) {
    const opts = {
        details: details,
        requestID: requestID
    };
    const operation = StellarSdk.CreateManageLimitsRequestBuilder.createManageLimitsRequest(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source)
        .then(response => {
            var result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            var id = result.result().results()[0].tr().createManageLimitsRequestResult().success().manageLimitsRequestId().toString();
            console.log("LimitsUpdateRequest created: " + id);
            return id
        })
}

module.exports = {
    createLimitsUpdateRequest
};