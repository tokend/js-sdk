const StellarSdk = require('../../lib/index');

function billPay(testHelper, sourceKP, sourceBalanceID, destination, amount, sourceFeeAsset, destFeeAsset,
                 sourcePaysForDest, requestId) {
    let opts = {
        requestId: requestId,
        sourceBalanceId: sourceBalanceID,
        destination: destination,
        amount: amount,
        feeData: {
            sourceFee: {
                maxPaymentFee: "50",
                fixedFee: "10",
                feeAsset: sourceFeeAsset,
            },
            destinationFee: {
                maxPaymentFee: "5",
                fixedFee: "5",
                feeAsset: destFeeAsset,
            },
            sourcePaysForDest: sourcePaysForDest,
        },
        subject: "Payment V2 test",
        reference: "",
    };

    let op = StellarSdk.BillPayBuilder.billPay(opts);
    return testHelper.server.submitOperationGroup([op], sourceKP.accountId(), sourceKP);
}

module.exports = {
    billPay
};