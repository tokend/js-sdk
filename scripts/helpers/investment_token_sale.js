const StellarSdk = require('../../lib/index');
let reviewableRequestHelper = require('./review_request');

function createSaleCreationRequest(testHelper, owner, baseAsset, amountToBeSold,
                                   quoteAssets, tradingStartDate,
                                   settlementStartDate, settlementEndDate,
                                   defaultRedemptionAsset) {
    let opts = {
        baseAsset: baseAsset,
        amountToBeSold: amountToBeSold,
        details: {
            short_description: "short sale description",
            description: "Investment token sale description",
            logo: {
                url: "logo_url",
                type: "logo_type",
            },
            name: "investment token sale name",
        },
        quoteAssets: quoteAssets,
        tradingStartDate: tradingStartDate,
        settlementStartDate: settlementStartDate,
        settlementEndDate: settlementEndDate,
        defaultRedemptionAsset: defaultRedemptionAsset,
    };
    let op = StellarSdk.ManageInvestmentTokenSaleCreationRequestBuilder
        .createITSaleCreationRequest(opts);
    return testHelper.server.submitOperationGroup([op], owner.accountId(), owner)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr().manageItSaleCreationRequestResult().success();
            console.log("create investment token sale creation request with id: " + success.requestId().toString());
            return success.requestId().toString();
        });
}

function createAndReviewSaleCreationRequest(testHelper, owner, baseAsset, amountToBeSold,
                                            quoteAssets, tradingStartDate,
                                            settlementStartDate, settlementEndDate,
                                            defaultRedemptionAsset, taskToRemove = 0) {
    return createSaleCreationRequest(testHelper, owner, baseAsset, amountToBeSold,
        quoteAssets, tradingStartDate, settlementStartDate, settlementEndDate,
        defaultRedemptionAsset)
        .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master,
            StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, taskToRemove))
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr().reviewRequestResult().success();
            let fulfilled = success.ext().extendedResult().fulfilled();
            if (fulfilled) {
                let saleID = success.ext().extendedResult().typeExt().investmentTokenSaleExtended().saleId().toString();
                console.log("InvestmentTokenSaleID: " + saleID);
                return saleID;
            }
        });
}

function updateSaleCreationRequest(testHelper, requestID, owner, baseAsset,
                                   amountToBeSold, quoteAssets, tradingStartDate,
                                   settlementStartDate, settlementEndDate,
                                   defaultRedemptionAsset) {
    let opts = {
        requestID: requestID,
        baseAsset: baseAsset,
        amountToBeSold: amountToBeSold,
        details: {
            short_description: "short sale description",
            description: "Investment token sale description",
            logo: {
                url: "logo_url",
                type: "logo_type",
            },
            name: "investment token sale name",
        },
        quoteAssets: quoteAssets,
        tradingStartDate: tradingStartDate,
        settlementStartDate: settlementStartDate,
        settlementEndDate: settlementEndDate,
        defaultRedemptionAsset: defaultRedemptionAsset,
    };
    let op = StellarSdk.ManageInvestmentTokenSaleCreationRequestBuilder
        .updateITSaleCreationRequest(opts);
    return testHelper.server.submitOperationGroup([op], owner.accountId(), owner)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr().manageItSaleCreationRequestResult().success();
            console.log("update investment token sale creation request with id: " + success.requestId().toString());
            return success.requestId().toString();
        });
}

function cancelSaleCreationRequest(testHelper, owner, requestID) {
    let opts = {
        requestID: requestID,
    };
    let operation = StellarSdk.ManageInvestmentTokenSaleCreationRequestBuilder
        .cancelITSaleCreationRequest(opts);
    return testHelper.server.submitOperationGroup([operation], owner.accountId(), owner)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr().manageItSaleCreationRequestResult().success();
            return success.requestId().toString();
        });
}

function createSaleParticipation(testHelper, source, saleID, quoteBalance, baseAmount) {
    let opts = {
        investmentTokenSaleID: saleID,
        quoteBalance: quoteBalance,
        baseAmount: baseAmount,
    };

    let op = StellarSdk.CreateInvestmentTokenSaleParticipationBuilder.createITSaleParticipation(opts);
    return testHelper.server.submitOperationGroup([op], source.accountId(), source);
}

function createProlongationSettlementOption(testHelper, source, saleID){
    let opts = {
        investmentTokenSaleID: saleID,
    };

    let op = StellarSdk.ManageSettlementOptionBuilder.createProlongationSettlementOption(opts);
    return testHelper.server.submitOperationGroup([op], source.accountId(), source)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr().manageSettlementOptionResult().success();
            let settlementOptionID = success.details().response().settlementOptionId().toString();
            console.log("Settlement option for prolongation created, ID: " + settlementOptionID);
            return settlementOptionID;
        });
}

function createRedemptionSettlementOption(testHelper, source, saleID, redemptionAsset){
    let opts = {
        investmentTokenSaleID: saleID,
        redemptionAsset: redemptionAsset
    };

    let op = StellarSdk.ManageSettlementOptionBuilder.createRedemptionSettlementOption(opts);
    return testHelper.server.submitOperationGroup([op], source.accountId(), source)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let success = result.result().results()[0].tr().manageSettlementOptionResult().success();
            let settlementOptionID = success.details().response().settlementOptionId().toString();
            console.log("Settlement option for redemption created, ID: " + settlementOptionID);
            return settlementOptionID;
        });
}

function removeSettlementOption(testHelper, source, settlementOptionID){
    let opts = {
        settlementOptionID: settlementOptionID,
    };

    let op = StellarSdk.ManageSettlementOptionBuilder.removeSettlementOption(opts);
    return testHelper.server.submitOperationGroup([op], source.accountId(), source);
}

function performSettlement(testHelper, source, saleID, newAsset, settlementAssets){
    let opts = {
        investmentTokenSaleID: saleID,
        newInvestmentToken: newAsset,
        settlementAssets: settlementAssets
    };

    let op = StellarSdk.PerformSettlementBuilder.performSettlement(opts);
    return testHelper.server.submitOperationGroup([op], source.accountId(), source);
}

module.exports = {
    createSaleCreationRequest,
    updateSaleCreationRequest,
    cancelSaleCreationRequest,
    createAndReviewSaleCreationRequest,
    createSaleParticipation,
    createProlongationSettlementOption,
    createRedemptionSettlementOption,
    removeSettlementOption,
    performSettlement
};