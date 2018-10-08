const StellarSdk = require('../../lib/index');

function createContractRequest(testHelper, source, customer, escrow, details, startTime, endTime) {
    const opts = {
        customer: customer.accountId(),
        escrow: escrow.accountId(),
        startTime: startTime,
        endTime: endTime,
        details: details
    };
    const operation = StellarSdk.ManageContractRequestBuilder.createContractRequest(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr().manageContractRequestResult().success();
            let id = success.details().response().requestId().toString();
            console.log(id, ' <-- Contract request successfully created');
            return id;
        });
}

function removeContractRequest(testHelper, source, requestId) {
    const opts = {
        requestId: requestId,
    };
    const operation = StellarSdk.ManageContractRequestBuilder.removeContractRequest(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
}

function addDetails(testHelper, source, contractID, details){
    const opts = {
        contractID: contractID,
        details: details
    };
    const operation = StellarSdk.ManageContractBuilder.addDetails(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
}

function confirmCompleted(testHelper, source, contractID){
    const opts = {
        contractID: contractID,
    };
    const operation = StellarSdk.ManageContractBuilder.confirmCompleted(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
}

function startDispute(testHelper, source, contractID, disputeReason){
    const opts = {
        contractID: contractID,
        disputeReason: disputeReason
    };
    const operation = StellarSdk.ManageContractBuilder.startDispute(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
}

function resolveDispute(testHelper, source, contractID, isRevert){
    const opts = {
        contractID: contractID,
        isRevert: isRevert
    };
    const operation = StellarSdk.ManageContractBuilder.resolveDispute(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
}

module.exports = {
    createContractRequest,
    removeContractRequest,
    addDetails,
    confirmCompleted,
    startDispute,
    resolveDispute,
};