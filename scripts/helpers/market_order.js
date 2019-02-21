const StellarSdk = require('../../lib/index');
var accountHelper = require('./accounts')


function createOrder(testHelper, source, baseAsset, quoteAsset, baseAmount, isBuy, orderBookID) {
    return accountHelper.loadBalanceIDForAsset(testHelper, source.accountId(), baseAsset)
    .then(baseBalanceID => {
        return accountHelper.loadBalanceIDForAsset(testHelper, source.accountId(), quoteAsset).then(quoteBalanceID => {
            return {baseBalanceID, quoteBalanceID};
        })
    }).then(balances => {
        let opts = {
            baseBalance: balances.baseBalanceID,
            quoteBalance: balances.quoteBalanceID,
            isBuy: isBuy,
            amount: baseAmount,
            orderBookID: orderBookID,
        };

        let operation = StellarSdk.MarketOrderBuilder.marketOrder(opts);
        return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
    }).then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            console.log(result.result().results()[0].tr().marketOrderResult());
            let offerID = result.result().results()[0].tr().marketOrderResult().success().offerId();
            if (offerID !== 0) {
                let id = offerID.toString();
                console.log("Order was not fully matched")
                console.log("Offer created: " + id);
                return id
            }

            console.log("Order fully matched");
        })
}


module.exports = {
    createOrder
};
