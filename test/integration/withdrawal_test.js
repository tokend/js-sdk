import * as assetHelper from '../../scripts/helpers/asset'
import * as accountHelper from '../../scripts/helpers/accounts'
import * as issuanceHelper from '../../scripts/helpers/issuance'
import * as manageKeyValueHelper from '../../scripts/helpers/key_value'
import * as withdrawHelper from '../../scripts/helpers/withdraw'
import * as reviewableRequestHelper from '../../scripts/helpers/review_request'

let config = require('../../scripts/config');


describe("Withdrawal tests", function () {

    let testHelper = config.getDefaultTestConfig(this);
    it("Create and withdraw asset", function (done) {
        var assetCode = "USD" + Math.floor(Math.random() * 1000);
        var assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value | StellarSdk.xdr.AssetPolicy.withdrawable().value;
        var preIssuedAmount = "10000.000000";
        var syndicateKP = StellarSdk.Keypair.random();
        var newAccountKP = StellarSdk.Keypair.random();
        console.log("Creating new account for issuance " + syndicateKP.accountId());
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, "asset_create_tasks", 1))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, "preissuance_tasks:" + assetCode, 0))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, "withdrawal_tasks:" + assetCode, 1))
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, preIssuedAmount))
            .then(() => accountHelper.createNewAccount(testHelper, newAccountKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, newAccountKP, assetCode, syndicateKP, preIssuedAmount))
            .then(() => accountHelper.loadBalanceForAsset(testHelper, newAccountKP.accountId(), assetCode))
            .then(balance => {
                expect(balance.balance).to.be.equal(preIssuedAmount);
            })
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, newAccountKP.accountId(), assetCode))
            // withdraw all the assets available with auto conversion to BTC
            .then(balanceID => withdrawHelper.withdraw(testHelper, newAccountKP, balanceID, preIssuedAmount))
            .then(requestID => reviewableRequestHelper.reviewWithdrawRequest(testHelper, requestID, syndicateKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value,
                "", 0, 1, { review_details: "Updated external details" }))
            .then(() => accountHelper.loadBalanceForAsset(testHelper, newAccountKP.accountId(), assetCode))
            .then(balance => {
                expect(balance.balance).to.be.equal("0.000000");
            })
            .then(() => done())
            .catch(err => {
                testHelper.handleError(err, done);
            });
    });
});