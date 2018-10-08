const StellarSdk = require('../../lib/index');
var accountHelper = require('./accounts')
const isUndefined = require('lodash/isUndefined');



function createOffer(testHelper, source, baseAsset, quoteAsset, price, baseAmount, isBuy, orderBookID) {
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
            price: price,
            orderBookID: orderBookID,
            fee: "0",
        };

        let operation = StellarSdk.ManageOfferBuilder.manageOffer(opts);
        return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
    }).then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let offer = result.result().results()[0].tr().manageOfferResult().success().offer().offer();
            if (!isUndefined(offer)) {
                let id = offer.offerId().toString();
                console.log("Offer created: " + id);
                return id
            }

            console.log("Offer fully matched");
        })
}

function cancelOffer(testHelper, source, baseAsset, quoteAsset, offerID, orderBookID) {
    return accountHelper.loadBalanceIDForAsset(testHelper, source.accountId(), baseAsset)
        .then(baseBalanceID => {
            return accountHelper.loadBalanceIDForAsset(testHelper, source.accountId(), quoteAsset).then(quoteBalanceID => {
                return {baseBalanceID, quoteBalanceID};
            })
        })
        .then(balances => {
            let opts = {
                baseBalance: balances.baseBalanceID,
                quoteBalance: balances.quoteBalanceID,
                offerID: offerID,
                orderBookID: orderBookID,
            };

            let operation = StellarSdk.ManageOfferBuilder.cancelOffer(opts);
            return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
        })
}

function findQuoteAssetForAsset(sale, quoteAsset) {
    for (var i = 0; i < sale.quote_assets.quote_assets.length; i++) {
        if (sale.quote_assets.quote_assets[i].asset == quoteAsset) {
            return sale.quote_assets.quote_assets[i];
        }
    }

    throw new Error("Failed to find quote asset of the sale for asset: " + quoteAsset);
}

function participateInSale(testHelper, source, baseAsset, quoteAmount, quoteAsset, baseAmount) {
    return testHelper.server.sales().forBaseAsset(baseAsset).callWithSignature(source).then(sales => {
        return sales.records[0];
    }).then(sale => {
        let saleQuoteAsset = findQuoteAssetForAsset(sale, quoteAsset);
        if (!!quoteAmount) {
            baseAmount = Math.round(Number.parseFloat(quoteAmount)/Number.parseFloat(saleQuoteAsset.price) * StellarSdk.Operation.ONE) /StellarSdk.Operation.ONE;
        }
        return createOffer(testHelper, source, sale.base_asset, quoteAsset, saleQuoteAsset.price, baseAmount.toString(), true, sale.id);
    });
}

function cancelSaleParticipation(testHelper, source, baseAsset, quoteAsset, offerID) {
    return testHelper.server.sales().forBaseAsset(baseAsset).callWithSignature(source).then(sales => {
        return sales.records[0];
    }).then(sale => {
        return cancelOffer(testHelper, source, sale.base_asset, quoteAsset, offerID, sale.id);
    });
}


module.exports = {
    createOffer,
    cancelOffer,
    participateInSale,
    cancelSaleParticipation
};