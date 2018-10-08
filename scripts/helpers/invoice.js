const StellarSdk = require('../../lib/index');

function createInvoiceRequest(testHelper, source, sender, asset, amount, details, contractID = undefined) {
    const opts = {
        sender: sender.accountId(),
        asset: asset,
        amount: amount,
        details: details,
        contractID: contractID
    };
    const operation = StellarSdk.ManageInvoiceRequestBuilder.createInvoiceRequest(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr().manageInvoiceRequestResult().success();
            let id = success.details().response().requestId().toString();
            let sourceBalanceID = StellarSdk.BaseOperation.balanceIdtoString(success.details().response().senderBalance());
            let destBalanceID = StellarSdk.BaseOperation.balanceIdtoString(success.details().response().receiverBalance());
            console.log(id, ' <-- Invoice Request successfully created');
            console.log('source: ', sourceBalanceID);
            console.log('dest: ', destBalanceID);
            return {id, sourceBalanceID, destBalanceID};
        });
}

function removeInvoiceRequest(testHelper, source, requestId) {
    const opts = {
        requestId: requestId,
    };
    const operation = StellarSdk.ManageInvoiceRequestBuilder.removeInvoiceRequest(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
}

module.exports = {
    createInvoiceRequest,
    removeInvoiceRequest
};