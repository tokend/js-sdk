const StellarSdk = require('../../lib/index');

function createLimits(testHelper, source, assetCode, accountID, accountType) {
    const opts = {
        accountID: accountID,
        accountType: accountType,
        statsOpType: 3,
        assetCode: assetCode,
        isConvertNeeded: false,
        dailyOut: '10',
        weeklyOut: '20',
        monthlyOut: '30',
        annualOut: '50',
    };
    const operation = StellarSdk.ManageLimitsBuilder.createLimits(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source)
    .then(response => {
        let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
        let success = result.result().results()[0].tr().manageLimitsResult().success();
        let id = success.details().id().toString();
        console.log(id, ' <-- LimitsV2 Entry successfully created');
        return id;
    });
}

function removeLimits(testHelper, source, limitsV2ID) {
    const opts = {
        id: limitsV2ID,
    };
    const operation = StellarSdk.ManageLimitsBuilder.removeLimits(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source)
}

module.exports = {
    createLimits,
    removeLimits
};