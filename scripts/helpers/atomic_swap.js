const StellarSdk = require('../../lib/index');

function createASwapBidCreationRequest(testHelper, source, baseBalanceID, amount,
                                       quoteAssets, details) {
    const opts = {
        balanceID: baseBalanceID,
        amount: amount,
        details: details,
        quoteAssets: quoteAssets
    };
    const operation = StellarSdk.CreateAtomicSwapBidCreationRequestBuilder
        .createASwapBidCreationRequest(opts);
    return testHelper.server.submitOperationGroup([operation],
        source.accountId(), source)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult
                .fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr()
                .createASwapBidCreationRequestResult().success();
            let id = success.requestId().toString();
            console.log(id,
                ' <-- Atomic swap bid creation request successfully created');
            return id;
        });
}

function cancelASwapBid(testHelper, source, bidId) {
    const opts = {
        bidID: bidId,
    };
    const operation = StellarSdk.CancelAtomicSwapBidBuilder.cancelASwapBid(opts);
    return testHelper.server.submitOperationGroup([operation],
        source.accountId(), source);
}

function createASwapRequest(testHelper, source, bidID, baseAmount, quoteAsset){
    const opts = {
        baseAmount: baseAmount,
        bidID: bidID,
        quoteAsset: quoteAsset
    };
    const operation = StellarSdk.CreateAtomicSwapRequestBuilder
        .createASwapRequest(opts);
    return testHelper.server.submitOperationGroup([operation],
        source.accountId(), source)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult
                .fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr()
                .createASwapRequestResult().success();
            let id = success.requestId().toString();
            console.log(id, ' <-- Atomic swap request successfully created');
            return id;
        });
}

module.exports = {
    createASwapBidCreationRequest,
    cancelASwapBid,
    createASwapRequest,
};