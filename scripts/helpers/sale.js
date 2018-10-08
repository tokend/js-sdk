import {isUndefined} from 'util';

var reviewableRequestHelper = require('./review_request')
const StellarSdk = require('../../lib/index');

function createSaleCreationRequest(testHelper, owner, baseAsset, defaultQuoteAsset, startTime, endTime, softCap, hardCap, quoteAssets, saleType, baseAssetForHardCap, saleState) {
    if (isUndefined(saleState)) {
        saleState = StellarSdk.xdr.SaleState.none();
    }
    let opts = {
        requestID: "0",
        baseAsset: baseAsset,
        defaultQuoteAsset: defaultQuoteAsset,
        name: baseAsset + defaultQuoteAsset,
        startTime: startTime,
        endTime: endTime,
        softCap: softCap,
        hardCap: hardCap,
        quoteAssets: quoteAssets,
        saleType: saleType,
        baseAssetForHardCap: baseAssetForHardCap,
        saleState: saleState,
        details: {
            short_description: "short description",
            description: "Token sale description",
            logo: {
                url: "logo_url",
                type: "logo_type",
            },
            name: "sale name",
        },
    };
    let operation = StellarSdk.SaleRequestBuilder.createSaleCreationRequest(opts);
    return testHelper.server.submitOperationGroup([operation], owner.accountId(), owner);
}

function createAndReviewSale(testHelper, owner, baseAsset, defaultQuoteAsset, startTime, endTime, softCap, hardCap,
                             quoteAssets, saleType, baseAssetForHardCap, saleState) {
    return createSaleCreationRequest(testHelper, owner, baseAsset, defaultQuoteAsset, startTime, endTime, softCap,
        hardCap, quoteAssets, saleType, baseAssetForHardCap, saleState)
        .then(response => {
            var result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            var success = result.result().results()[0].tr().createSaleCreationRequestResult().success();
            var id = success.requestId().toString();
            return reviewableRequestHelper.reviewRequest(testHelper, id, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "");
        }).then(res => {
            console.log(baseAsset, defaultQuoteAsset, ' <-- Sale successfully created');
            return res;
        })
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let saleID = result.result().results()[0].tr().reviewRequestResult().success().ext().extendedResult().typeExt().saleExtended().saleId().toString();
            console.log("SaleID: " + saleID);
            return saleID;
        });
}

function createSale(testHelper, owner, baseAsset, defaultQuoteAsset, startTime, endTime, softCap, hardCap,
                    quoteAssets, saleType, baseAssetForHardCap, saleState) {
    return createSaleCreationRequest(testHelper, owner, baseAsset, defaultQuoteAsset, startTime, endTime, softCap,
        hardCap, quoteAssets, saleType, baseAssetForHardCap, saleState)
        .then(response => {
            var result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            var success = result.result().results()[0].tr().createSaleCreationRequestResult().success();
            return success.requestId().toString();
        });
}

function cancelSaleCreationRequest(testHelper, owner, requestID) {
    let opts = {
        requestID: requestID,
    };
    let operation = StellarSdk.SaleRequestBuilder.cancelSaleCreationRequest(opts);
    return testHelper.server.submitOperationGroup([operation], owner.accountId(), owner);
}

function createPromotionUpdateRequest(testHelper, owner, saleID, baseAsset, defaultQuoteAsset,
                                      startTime, endTime, softCap, hardCap, quoteAssets, saleType,
                                      baseAssetForHardCap, saleState, requestID = "0") {
    let opts = {
        saleID: saleID,
        requestID: requestID,
        baseAsset: baseAsset,
        defaultQuoteAsset: defaultQuoteAsset,
        name: baseAsset + defaultQuoteAsset,
        startTime: startTime,
        endTime: endTime,
        softCap: softCap,
        hardCap: hardCap,
        quoteAssets: quoteAssets,
        saleType: saleType,
        baseAssetForHardCap: baseAssetForHardCap,
        saleState: saleState,
        details: {
            short_description: "short description",
            description: "Token sale description",
            logo: {
                url: "logo_url",
                type: "logo_type",
            },
            name: "sale name",
        },
    };

    let operation = StellarSdk.ManageSaleBuilder.createPromotionUpdateRequest(opts);
    return testHelper.server.submitOperationGroup([operation], owner.accountId(), owner)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let id = result.result().results()[0].tr().manageSaleResult().success().response().promotionUpdateRequestId().toString();
            console.log("PromotionUpdateRequest created: " + id);
            return id;
        });
}

function checkSaleState(testHelper, baseAsset) {
    return testHelper.server.sales().forBaseAsset(baseAsset).callWithSignature(testHelper.master).then(sales => {
        return sales.records[0];
    }).then(sale => {
        let operation = StellarSdk.SaleRequestBuilder.checkSaleState({saleID: sale.id});
        return testHelper.server.submitOperationGroup([operation], testHelper.master.accountId(), testHelper.master);
    }).then(response => {
        return response;
    });
}

function setSaleState(testHelper, saleID, state) {
    let opts = {
        saleID: saleID,
        saleState: state,
    };

    let operation = StellarSdk.ManageSaleBuilder.setSaleState(opts);
    return testHelper.server.submitOperationGroup([operation], testHelper.master.accountId(), testHelper.master);
}

function createUpdateSaleDetailsRequest(testHelper, owner, saleID) {
    let opts = {
        requestID: "0",
        saleID: saleID,
        newDetails: {
            short_description: "updated short description",
            description: "Token sale description",
            logo: {
                url: "logo_url",
                type: "logo_type",
            },
            name: "updated sale name",
        },
    };

    let operation = StellarSdk.ManageSaleBuilder.createUpdateSaleDetailsRequest(opts);
    return testHelper.server.submitOperation(operation, owner.accountId(), owner)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let id = result.result().results()[0].tr().manageSaleResult().success().response().requestId().toString();
            console.log("UpdateSaleDetailsRequest created: " + id);
            return id;
        });
}

function createUpdateSaleEndTimeRequest(testHelper, owner, saleID, newEndTime) {
    let opts = {
        requestID: '0',
        saleID: saleID,
        newEndTime: newEndTime,
    };

    let operation = StellarSdk.ManageSaleBuilder.createUpdateSaleEndTimeRequest(opts);
    return testHelper.server.submitOperationGroup([operation], owner.accountId(), owner)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let id = result.result().results()[0].tr().manageSaleResult().success().response().updateEndTimeRequestId().toString();
            console.log("UpdateSaleEndTimeRequest created: " + id);
            return id;
        });
}

function cancelSale(testHelper, owner, saleID) {
    let opts = {
        saleID: saleID,
    };
    let operation = StellarSdk.ManageSaleBuilder.cancelSale(opts);
    return testHelper.server.submitOperation(operation, owner.accountId(), owner);
}

module.exports = {
    createSaleCreationRequest,
    createAndReviewSale,
    createSale,
    cancelSaleCreationRequest,
    checkSaleState,
    createUpdateSaleDetailsRequest,
    cancelSale,
    setSaleState,
    createUpdateSaleEndTimeRequest,
    createPromotionUpdateRequest
};