const StellarSdk = require('../../lib/index');
var reviewableRequestHelper = require('./review_request')
var accountHelper = require('./accounts')


function createPreIssuanceRequest(testHelper, assetOwnerKP, preIssuanceKP, assetCode, amount) {
    var preIssuanceRequest = StellarSdk.PreIssuanceRequest.build({
        amount: amount,
        reference: StellarSdk.Keypair.random().accountId(),
        asset: assetCode,
        keyPair: preIssuanceKP,
    });
    let op = StellarSdk.PreIssuanceRequestOpBuilder.createPreIssuanceRequestOp({ request: preIssuanceRequest });
    return testHelper.server.submitOperationGroup([op], assetOwnerKP.accountId(), assetOwnerKP);
}

function performPreIssuance(testHelper, assetOwnerKP, preIssuanceKP, assetCode, amount) {
    return createPreIssuanceRequest(testHelper, assetOwnerKP, preIssuanceKP, assetCode, amount)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let fulfilled = result.result().results()[0].tr().createPreIssuanceRequestResult().success().fulfilled();
            if (fulfilled)
                return response;
            let id = result.result().results()[0].tr().createPreIssuanceRequestResult().success().requestId().toString();
            return reviewableRequestHelper.reviewRequest(testHelper, id, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "");
        })
        .then(res => {
            console.log('PerformedPreIssuance: ', amount, assetCode);
            return res
        }).catch(err => {
            console.log(err.response.data.extras);
            throw err;
        });
}

function createIssuanceRequest(testHelper, requestor, receiverBalanceID, asset, amount, allTasks)
{
    const opts = {
        asset: asset,
        amount: amount,
        receiver: receiverBalanceID,
        reference: StellarSdk.Keypair.random().accountId(),
        externalDetails: { a: "some external details" },
        allTasks: allTasks
    };

    const op = StellarSdk.CreateIssuanceRequestBuilder.createIssuanceRequest(opts);
    return testHelper.server.submitOperation(op, requestor.accountId(), requestor)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let requestID = result.result().results()[0].tr().createIssuanceRequestResult().success().requestId();
            console.log('Issuance request created: ' + requestID);
            return requestID;
        });
}

function issue(testHelper, requestor, receiverBalanceID, asset, amount, allTasks) {
    const opts = {
        asset: asset,
        amount: amount,
        receiver: receiverBalanceID,
        reference: StellarSdk.Keypair.random().accountId(),
        externalDetails: { a: "some external details" },
        allTasks: allTasks
    };

    const op = StellarSdk.CreateIssuanceRequestBuilder.createIssuanceRequest(opts);
    return testHelper.server.submitOperationGroup([op], requestor.accountId(), requestor)
        .then(res => {
            console.log('Issued: ', amount, asset, 'to', receiverBalanceID)
            return res
        });
}

// fundAccount - creates new balance and issues funds to it
function fundAccount(testHelper, accountToBeFundedKP, assetCode, assetOwnerKP, amount) {
    return accountHelper.loadBalanceIDForAsset(testHelper, accountToBeFundedKP.accountId(), assetCode).catch(() => {
        return accountHelper.createBalanceForAsset(testHelper, accountToBeFundedKP, assetCode).then(() => {
            return accountHelper.loadBalanceIDForAsset(testHelper, accountToBeFundedKP.accountId(), assetCode)
        })
    }).then(balanceID => issue(testHelper, assetOwnerKP, balanceID, assetCode, amount, 0))
}

module.exports = {
    createPreIssuanceRequest,
    createIssuanceRequest,
    performPreIssuance,
    issue,
    fundAccount
};