var reviewableRequestHelper = require('./review_request')
const StellarSdk = require('../../lib/index');
const MAX_INT64_AMOUNT = '9223372036854.775807';

function createAssetCreationRequest(testHelper, owner, issuer, assetCode,
                                    policy = 0, maxIssuanceAmount = "100000000",
                                    initialPreissuedAmount = "0", expirationDate = MAX_INT64_AMOUNT,
                                    trailingDigitsCount = "6") {
    console.log(assetCode, maxIssuanceAmount)
    let opts = {
        requestID: "0",
        code: assetCode,
        preissuedAssetSigner: issuer,
        maxIssuanceAmount: maxIssuanceAmount,
        policies: policy,
        initialPreissuedAmount: initialPreissuedAmount,
        details: {
            name: assetCode + " name",
            documents: ["asd1", "asd2"],
            logo: {
                url: "logo_url",
                type: "logo_type",
            },
        },
        expirationDate: expirationDate,
        trailingDigitsCount: trailingDigitsCount,
    };
    let operation = StellarSdk.ManageAssetBuilder.assetCreationRequest(opts);
    return testHelper.server.submitOperationGroup([operation], owner.accountId(), owner);
}

function createAssetUpdateRequest(testHelper, owner, issuer, assetCode,
                                  policy = 0, expirationDate = MAX_INT64_AMOUNT) {
    let opts = {
        requestID: "0",
        code: assetCode,
        policies: policy,
        details: {
            name: assetCode + " name",
            documents: ["asd1", "asd2"],
            logo: {
                url: "logo_url",
                type: "logo_type",
            },
        },
        expirationDate: expirationDate,
    };
    let operation = StellarSdk.ManageAssetBuilder.assetUpdateRequest(opts);
    return testHelper.server.submitOperationGroup([operation], owner.accountId(), owner);
}

function createAsset(testHelper, owner, issuer, assetCode, policy, maxIssuanceAmount,
                     initialPreissuedAmount = "0", expirationDate = MAX_INT64_AMOUNT, trailingDigitsCount = "6") {
    return createAssetCreationRequest(testHelper, owner, issuer, assetCode, policy,
      maxIssuanceAmount, initialPreissuedAmount, expirationDate, trailingDigitsCount)
        .then(response => {
            var result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            var success = result.result().results()[0].tr().manageAssetResult().success()
            if (success.fulfilled() === true) {
                return 'Asset created'
            }
            var id = success.requestId().toString();
            return reviewableRequestHelper.reviewRequest(testHelper, id, testHelper.master,
                StellarSdk.xdr.ReviewRequestOpAction.approve().value, "");
        }).then(res => {
            console.log(assetCode, ' <-- Asset successfully created');
            return res;
        });
}

function updateAsset(testHelper, owner, issuer, assetCode, policy, expirationDate = MAX_INT64_AMOUNT) {
    return createAssetUpdateRequest(testHelper, owner, issuer, assetCode, policy, expirationDate)
        .then(response => {
            var result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            var success = result.result().results()[0].tr().manageAssetResult().success()
            if (success.fulfilled() === true) {
                return 'Asset updated'
            }
            var id = success.requestId().toString();
            return reviewableRequestHelper.reviewRequest(testHelper, id, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "");
        }).then(res => {
            console.log(assetCode, ' <-- Asset successfully updated');
            return res;
        });
}

function createAssetPair(testHelper, baseAsset, quoteAsset, physicalPrice = "1", policies = 0) {
    let operation = StellarSdk.Operation.manageAssetPair({
        action: StellarSdk.xdr.ManageAssetPairAction.create(),
        base: baseAsset,
        quote: quoteAsset,
        policies: policies,
        physicalPriceCorrection: "0",
        maxPriceStep: "0",
        physicalPrice: physicalPrice,
    });
    return testHelper.server.submitOperationGroup([operation], testHelper.master.accountId(), testHelper.master);
}


function changePreIssuerSigner(testHelper, code, newPreIssuer, owner, preIssuerKP) {
    let operation = StellarSdk.ManageAssetBuilder.changeAssetPreIssuer({
        code: code,
        accountID: newPreIssuer,
    });
    return testHelper.server.submitOperation(operation, owner.accountId(), preIssuerKP);
}

function updateAssetPrice(testHelper, baseAsset, quoteAsset, physicalPrice = "1") {
    let operation = StellarSdk.Operation.manageAssetPair({
        action: StellarSdk.xdr.ManageAssetPairAction.updatePrice(),
        base: baseAsset,
        quote: quoteAsset,
        policies: 0,
        physicalPriceCorrection: "0",
        maxPriceStep: "0",
        physicalPrice: physicalPrice,
    });
    return testHelper.server.submitOperation(operation, testHelper.master.accountId(), testHelper.master);
}

module.exports = {
    createAssetCreationRequest,
    createAsset,
    updateAsset,
    createAssetPair,
    updateAssetPrice,
    changePreIssuerSigner
}