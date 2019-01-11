import * as assetHelper from '../../scripts/helpers/asset'
import * as accountHelper from '../../scripts/helpers/accounts'
import * as issuanceHelper from '../../scripts/helpers/issuance'
import * as manageKeyValueHelper from '../../scripts/helpers/key_value'
import * as withdrawHelper from '../../scripts/helpers/withdraw'
import * as reviewableRequestHelper from '../../scripts/helpers/review_request'
import * as manageLimitsHelper from '../../scripts/helpers/manage_limits'
import * as limitsUpdateHelper from '../../scripts/helpers/limits_update'

let config = require('../../scripts/config');


describe("Issuance tests", function () {

    let testHelper = config.getDefaultTestConfig(this);
    it("Issuance: insufficient preissued amount", function (done) {
        let assetCode = testHelper.generateAssetCode("BTC");
        let assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value;
        let insufficientAmount = "5000.000000";
        let amountToIssue = "10000.000000";
        let syndicateKP = StellarSdk.Keypair.random();
        let issuanceTasks = {
            key: "issuance_tasks:" + assetCode,
            value: "8"
        };

        console.log("Creating new account for issuance " + syndicateKP.accountId());

        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, "preissuance_tasks:" + assetCode, 0))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, "asset_create_tasks", 1))
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy,
                amountToIssue, insufficientAmount))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, issuanceTasks.key, issuanceTasks.value))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, syndicateKP.accountId(), assetCode))
            .then(balanceID => issuanceHelper.createIssuanceRequest(testHelper, syndicateKP, balanceID, assetCode, amountToIssue))
            .then(requestID => {
                // as we do not have sufficient preissuance amount available, review should be successful, but will not 
                // lead to fulfillment of the request
                return reviewableRequestHelper.reviewRequest(testHelper, requestID.toString(), syndicateKP,
                    StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 8, { comment: "Deposit is verified" })
                    .then(() => reviewableRequestHelper.loadRequestWithRetry(testHelper, requestID, syndicateKP))
                    .then(request => {
                        expect(request.pending_tasks).to.be.equal(1);
                        expect(request.request_state).to.be.equal("pending");
                    })
                    .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, insufficientAmount))
                    .then(() => reviewableRequestHelper.reviewRequest(testHelper, requestID.toString(), syndicateKP,
                        StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 1, { comment: "Deposit is fully verified" }))
                    .then(() => reviewableRequestHelper.loadRequestWithRetry(testHelper, requestID, syndicateKP, StellarSdk.xdr.ReviewableRequestType.issuanceCreate().value))
                    .then(request => {
                        expect(request.request_state).to.be.equal("approved");
                    });
            })
            .then(() => accountHelper.loadBalanceForAsset(testHelper, syndicateKP.accountId(), assetCode))
            .then(balance => {
                expect(balance.balance).to.be.equal(amountToIssue);
            })
            .then(() => done())
            .catch(err => {
                testHelper.handleError(err, done);
            });
    });

    it("Manual review required flow with reject", function (done) {
        let assetCode = testHelper.generateAssetCode("BTC");
        let assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value | StellarSdk.xdr.AssetPolicy.issuanceManualReviewRequired().value;
        let amountToIssue = "10000.000000";
        let syndicateKP = StellarSdk.Keypair.random();
        let newAccountKP = StellarSdk.Keypair.random();
        let issuanceTasks = {
            key: "issuance_tasks:" + assetCode,
            value: "8"
        };
        let issuanceRequestID;

        console.log("Creating new account for issuance " + syndicateKP.accountId());

        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, "asset_create_tasks", 1))
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy, amountToIssue, amountToIssue))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, issuanceTasks.key, issuanceTasks.value))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, syndicateKP.accountId(), assetCode))
            .then(balanceID => issuanceHelper.createIssuanceRequest(testHelper, syndicateKP, balanceID, assetCode, amountToIssue, 0))
            .then(requestID => {
                return reviewableRequestHelper.loadRequestWithRetry(testHelper, requestID, syndicateKP,
                    StellarSdk.xdr.ReviewableRequestType.issuanceCreate().value)
                    .then(request => {
                        expect(request.pending_tasks).to.be.equal(2);
                        expect(request.request_state).to.be.equal("pending");
                    }).then(() => reviewableRequestHelper.reviewRequest(testHelper, requestID, syndicateKP,
                        StellarSdk.xdr.ReviewRequestOpAction.permanentReject().value, "Because we can"))
                    .then(() => reviewableRequestHelper.loadRequestWithRetry(testHelper, requestID, syndicateKP,
                        StellarSdk.xdr.ReviewableRequestType.issuanceCreate().value))
                    .then(request => {
                        expect(request.pending_tasks).to.be.equal(2);
                        expect(request.request_state).to.be.equal("permanently_rejected");
                        return request.id.toString();
                    });
            })
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });
});