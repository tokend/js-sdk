import * as feesHelper from '../../scripts/helpers/fees'
import * as reviewableRequestHelper from '../../scripts/helpers/review_request'
import * as issuanceHelper from '../../scripts/helpers/issuance'
import * as assetHelper from '../../scripts/helpers/asset'
import * as accountHelper from '../../scripts/helpers/accounts'
import * as withdrawHelper from '../../scripts/helpers/withdraw'
import * as saleHelper from '../../scripts/helpers/sale'
import * as offerHelper from '../../scripts/helpers/offer'
import * as limitsUpdateHelper from '../../scripts/helpers/limits_update'
import * as manageKeyValueHelper from '../../scripts/helpers/key_value'
import * as manageExternalSystemAccountIdPoolEntryHelper
    from '../../scripts/helpers/manage_external_system_account_id_pool_entry'
import * as bindExternalSystemAccountIdHelper from '../../scripts/helpers/bind_external_system_account_id'
import * as amlAlertHelper from '../../scripts/helpers/aml_alert'
import * as kycHelper from '../../scripts/helpers/kyc'
import * as paymentV2Helper from '../../scripts/helpers/payment_v2'
import * as manageLimitsHelper from '../../scripts/helpers/manage_limits'
import * as manageInvoiceRequestHelper from '../../scripts/helpers/invoice'
import * as contractHelper from '../../scripts/helpers/contract'
import * as atomicSwapHelper from '../../scripts/helpers/atomic_swap'
import * as helpers from '../../scripts/helpers'
let config = require('../../scripts/config');

const MAX_INT64_AMOUNT = '9223372036854.775807';

describe("Integration test", function () {
    // We need to wait for a ledger to close
    const TIMEOUT = 60 * 20000;
    this.timeout(TIMEOUT);
    this.slow(TIMEOUT / 2);

    let env = 'local';
    let currentConfig = config.getConfig(env);
    let server = currentConfig.server;
    let master = currentConfig.master;

    let testHelper = {
        master: master,
        server: server,
    };

    before(function (done) {
        this.timeout(60 * 1000);
        checkConnection(done);
    });

    function checkConnection(done) {
        server.loadAccountWithSign(master.accountId(), master)
            .then(source => {
                console.log('Horizon up and running!');
                done();
            })
            .catch(err => {
                console.log(err);
                console.log("Couldn't connect to Horizon... Trying again.");
                setTimeout(() => checkConnection(done), 20000);
            });
    }

    it("Charge transaction fee", function (done) {
        let txFeeAssetCode = "BTC" + Math.floor(Math.random() * 1000);
        let preIssuedAmount = "10000.000000";
        let txSourceKP = StellarSdk.Keypair.random();
        let assetToIssueCode = "ETH" + Math.floor(Math.random() * 1000);
        let txFeeKey = "tx_fee_asset";
        assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), txFeeAssetCode,
            StellarSdk.xdr.AssetPolicy.baseAsset().value, preIssuedAmount, preIssuedAmount)
            .then(() => accountHelper.createNewAccount(testHelper, txSourceKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, txSourceKP, txFeeAssetCode, testHelper.master, preIssuedAmount))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, txFeeKey, txFeeAssetCode))
            .then(() => feesHelper.setFees(testHelper, StellarSdk.xdr.FeeType.operationFee(), "10", "0", txFeeAssetCode,
                StellarSdk.xdr.OperationType.manageAsset().value.toString()))
            .then(() => assetHelper.createAssetCreationRequest(testHelper, txSourceKP, txSourceKP.accountId(), assetToIssueCode))
            .then(() => feesHelper.setFees(testHelper, StellarSdk.xdr.FeeType.operationFee(), "10", "0", txFeeAssetCode,
                StellarSdk.xdr.OperationType.manageAsset().value.toString(), true))
            .then(() => assetHelper.createAssetCreationRequest(testHelper, txSourceKP, txSourceKP.accountId(),
                "UAH" + Math.floor(Math.random() * 1000)))
            .then(() => done())
            .catch(err => {
                done(err)
            });
    });

    it("Create atomic swap bid", function (done) {
        let baseAsset = "DL1TICKETS" + Math.floor(Math.random() * 1000);
        let firstQuoteAsset = "XRP" + Math.floor(Math.random() * 1000);
        let secondQuoteAsset = "LTC" + Math.floor(Math.random() * 1000);
        let quoteAssets = [{asset: firstQuoteAsset, price: "10"}, {asset: secondQuoteAsset, price: "20"}];
        let details = {"data" : "some random details"};
        let preIssuedAmount = "10000.000000";
        let sellerKP = StellarSdk.Keypair.random();
        let firstBuyerKP = StellarSdk.Keypair.random();
        let secondBuyerKP = StellarSdk.Keypair.random();
        let atomicSwapKey = "atomic_swap_tasks";
        let bidID;
        let balanceID;
        let canceledBidID;
        accountHelper.createNewAccount(testHelper, sellerKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => accountHelper.createNewAccount(testHelper, firstBuyerKP.accountId(), StellarSdk.xdr.AccountType.verified().value, 0))
            .then(() => accountHelper.createNewAccount(testHelper, secondBuyerKP.accountId(), StellarSdk.xdr.AccountType.notVerified().value, 0))
            .then(() => assetHelper.createAsset(testHelper, sellerKP, sellerKP.accountId(), baseAsset,
                StellarSdk.xdr.AssetPolicy.canBeBaseInAtomicSwap().value))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), firstQuoteAsset,
                StellarSdk.xdr.AssetPolicy.canBeQuoteInAtomicSwap().value))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), secondQuoteAsset,
                StellarSdk.xdr.AssetPolicy.canBeQuoteInAtomicSwap().value))
            .then(() => issuanceHelper.performPreIssuance(testHelper, sellerKP, sellerKP, baseAsset, preIssuedAmount))
            .then(() => issuanceHelper.fundAccount(testHelper, sellerKP, baseAsset, sellerKP, preIssuedAmount))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, atomicSwapKey, "1", StellarSdk.xdr.KeyValueEntryType.uint32().value))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, sellerKP.accountId(), baseAsset))
            .then(localBalanceID => {
                balanceID = localBalanceID;
                return atomicSwapHelper.createASwapBidCreationRequest(testHelper, sellerKP, balanceID, "1234", quoteAssets, details);
            })
            //.then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, ""))
            .then(response => {
                //let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
                // FIXME: remove hardcoded bid ID
                canceledBidID = '1'; // result.result().results()[0].tr().reviewRequestResult().success().ext().extendedResult().typeExt().aSwapBidExtended().bidId().toString();
                console.log("BidID: " + canceledBidID);
                return atomicSwapHelper.createASwapRequest(testHelper, firstBuyerKP, canceledBidID, "5", firstQuoteAsset);
            })
            .then(() => atomicSwapHelper.cancelASwapBid(testHelper, sellerKP, canceledBidID))
            .then(() => atomicSwapHelper.createASwapBidCreationRequest(testHelper, sellerKP, balanceID, "10", quoteAssets, details))
            //.then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, ""))
            .then(response => {
                //let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
                // FIXME: remove hardcoded bid ID
                bidID = '2';// result.result().results()[0].tr().reviewRequestResult().success().ext().extendedResult().typeExt().aSwapBidExtended().bidId().toString();
                console.log("BidID: " + bidID);
                return atomicSwapHelper.createASwapRequest(testHelper, firstBuyerKP, bidID, "8", firstQuoteAsset);
            })
            .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "",undefined, 0, 1))
            .then(() => atomicSwapHelper.createASwapRequest(testHelper, secondBuyerKP, bidID, "2", secondQuoteAsset))
            .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 1))
            .then(() => done())
            .catch(helpers.errorHandler);
    });

    it("Create and withdraw asset", function (done) {
        var assetCode = "USD" + Math.floor(Math.random() * 1000);
        var assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value | StellarSdk.xdr.AssetPolicy.withdrawable().value | StellarSdk.xdr.AssetPolicy.twoStepWithdrawal().value;
        var preIssuedAmount = "10000.000000";
        var syndicateKP = StellarSdk.Keypair.random();
        var newAccountKP = StellarSdk.Keypair.random();
        console.log("Creating new account for issuance " + syndicateKP.accountId());
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, preIssuedAmount))
            .then(() => accountHelper.createNewAccount(testHelper, newAccountKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, newAccountKP, assetCode, syndicateKP, preIssuedAmount))
            .then(() => accountHelper.loadBalanceForAsset(testHelper, newAccountKP.accountId(), assetCode))
            .then(balance => {
                expect(balance.balance).to.be.equal(preIssuedAmount);

            })
            // withdraw all the assets available with auto conversion to BTC
            .then(() => {
                let autoConversionAsset = "BTC" + Math.floor(Math.random() * 1000);
                return assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), autoConversionAsset, 0)
                    .then(() => assetHelper.createAssetPair(testHelper, assetCode, autoConversionAsset))
                    .then(() => accountHelper.loadBalanceIDForAsset(testHelper, newAccountKP.accountId(), assetCode))
                    .then(balanceID => {
                        return withdrawHelper.withdraw(testHelper, newAccountKP, balanceID, preIssuedAmount, autoConversionAsset)
                    })
                    .then(requestID => {
                        return reviewableRequestHelper.reviewTwoStepWithdrawRequest(testHelper, requestID, syndicateKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value,
                            "", {two_step_details: "Updated two step external details"}).then(() => {
                            return reviewableRequestHelper.reviewWithdrawRequest(testHelper, requestID, syndicateKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value,
                                "", {one_step_withdrawal: "Updated external details"}, StellarSdk.xdr.ReviewableRequestType.withdraw().value)
                        });
                    })
            })
            .then(() => done())
            .catch(err => {
                done(err)
            });
    });

    it("New issuance flow", function (done) {
        let assetCode = "BTC" + Math.floor(Math.random() * 1000);
        let assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value;
        let insufficientAmount = "5000.000000";
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
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, insufficientAmount))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, issuanceTasks.key, issuanceTasks.value))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, syndicateKP.accountId(), assetCode))
            .then(balanceID => issuanceHelper.createIssuanceRequest(testHelper, syndicateKP, balanceID, assetCode, amountToIssue))
            .then(newIssuanceRequestID => {
                issuanceRequestID = newIssuanceRequestID;
                reviewableRequestHelper.reviewRequest(testHelper, issuanceRequestID.toString(), syndicateKP,
                    StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 8, {comment: "Deposit is verified"});
            })
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, amountToIssue))
            .then(() => reviewableRequestHelper.reviewRequest(testHelper, issuanceRequestID.toString(), syndicateKP,
                StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 8, {comment: "Deposit is verified"}))
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    it("Manual review required for issuance", function (done) {
        let assetCode = "BTC" + Math.floor(Math.random() * 1000);
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
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, amountToIssue))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, issuanceTasks.key, issuanceTasks.value))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, syndicateKP.accountId(), assetCode))
            .then(balanceID => issuanceHelper.createIssuanceRequest(testHelper, syndicateKP, balanceID, assetCode, amountToIssue, 0))
            .then(newIssuanceRequestID => {
                issuanceRequestID = newIssuanceRequestID;
                reviewableRequestHelper.reviewRequest(testHelper, issuanceRequestID.toString(), syndicateKP,
                    StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 8, {comment: "Deposit is verified"});
            })
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    it("Ingest: ensure reviewable request state is approved", function (done) {
        let assetCode = "BTC" + Math.floor(Math.random() * 1000);
        let assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value;
        let amountToIssue = "10000.000000";
        let syndicateKP = StellarSdk.Keypair.random();
        let newAccountKP = StellarSdk.Keypair.random();
        let issuanceTasks = {
            key: "issuance_tasks:" + assetCode,
            value: "56"
        };
        let issuanceRequestID;

        console.log("Creating new account for issuance " + syndicateKP.accountId());

        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, amountToIssue))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, issuanceTasks.key, issuanceTasks.value))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, syndicateKP.accountId(), assetCode))
            .then(balanceID => issuanceHelper.createIssuanceRequest(testHelper, syndicateKP, balanceID, assetCode, amountToIssue, issuanceTasks.value))
            .then(newIssuanceRequestID =>  {
                issuanceRequestID = newIssuanceRequestID;
                    return reviewableRequestHelper.reviewRequest(testHelper, issuanceRequestID.toString(), syndicateKP,
                        StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 56, {comment: "Approved"})
            })
            .then(tx => {
                helpers.tx.waitForTX(testHelper, tx.hash);
            })
            .then(()=> {
                return reviewableRequestHelper.loadRequestWithRetry(testHelper, issuanceRequestID.toString(), syndicateKP);
            })
            .then(response => {
                expect(response.request_state).to.be.equal("approved");
            })
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    it("Ingest: ensure reviewable request state is rejected", function (done) {
        let assetCode = "BTC" + Math.floor(Math.random() * 1000);
        let assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value;
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
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, amountToIssue))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, issuanceTasks.key, issuanceTasks.value))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, syndicateKP.accountId(), assetCode))
            .then(balanceID => issuanceHelper.createIssuanceRequest(testHelper, syndicateKP, balanceID, assetCode, amountToIssue, issuanceTasks.value))
            .then(newIssuanceRequestID => {
                issuanceRequestID = newIssuanceRequestID;
                return reviewableRequestHelper.reviewRequest(testHelper, issuanceRequestID.toString(), syndicateKP,
                    StellarSdk.xdr.ReviewRequestOpAction.permanentReject().value, "Because we can");
            })
            .then(tx => {
                helpers.tx.waitForTX(testHelper, tx.hash);
            })
            .then(()=> {
                return reviewableRequestHelper.loadRequestWithRetry(testHelper, issuanceRequestID.toString(), syndicateKP);
            })
            .then(response => {
                expect(response.request_state).to.be.equal("permanently_rejected");
            })
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    it("Several tasks for issuance", function (done) {
        let assetCode = "BTC" + Math.floor(Math.random() * 1000);
        let assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value;
        let amountToIssue = "10000.000000";
        let syndicateKP = StellarSdk.Keypair.random();
        let issuanceTasks = {
            key: "issuance_tasks:" + assetCode,
            value: "8"
        };
        let issuanceRequestID;

        console.log("Creating new account for issuance " + syndicateKP.accountId());

        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, amountToIssue))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, issuanceTasks.key, issuanceTasks.value))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, syndicateKP.accountId(), assetCode))
            .then(balanceID => issuanceHelper.createIssuanceRequest(testHelper, syndicateKP, balanceID, assetCode, amountToIssue, 24))
            .then(newIssuanceRequestID => {
                issuanceRequestID = newIssuanceRequestID;
                reviewableRequestHelper.reviewRequest(testHelper, issuanceRequestID.toString(), syndicateKP,
                    StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 8, {comment: "First review completed"});
            })
            .then(() => reviewableRequestHelper.reviewRequest(testHelper, issuanceRequestID.toString(), syndicateKP,
                StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 16, {comment: "Second review completed"}))
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });
    it("Issue with deposit limits", function (done) {
        let assetCode = "BTC" + Math.floor(Math.random() * 1000);
        let assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value;
        let amountToIssue = "100.000000";
        let syndicateKP = StellarSdk.Keypair.random();

        let issuanceRequestID;
        var newLimits = {
            accountID: syndicateKP.accountId(),
            statsOpType: 4,
            assetCode: assetCode,
            isConvertNeeded: false,
            dailyOut: "1000.000000",
            weeklyOut: "2000.000000",
            monthlyOut: "3000.000000",
            annualOut: "5000.000000"
        };
        var limitsV2EntryID;

        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy))
            .then(() => manageLimitsHelper.createLimits(testHelper, testHelper.master, assetCode, syndicateKP.accountId()))
            .then(id => {
                limitsV2EntryID = id;
                return limitsUpdateHelper.createLimitsUpdateRequest(testHelper, syndicateKP, {"data" : "Some details"}, "0");
            })
            .then(requestID => {
                newLimits.id = limitsV2EntryID;
                return reviewableRequestHelper.reviewLimitsUpdateRequest(testHelper, requestID, master, StellarSdk.xdr.ReviewRequestOpAction.approve().value,
                    "", newLimits);
            })
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, amountToIssue))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, syndicateKP.accountId(), assetCode))
            .then(balanceID => issuanceHelper.createIssuanceRequest(testHelper, syndicateKP, balanceID, assetCode, amountToIssue, 24))
            .then(newIssuanceRequestID => {
                issuanceRequestID = newIssuanceRequestID;
                reviewableRequestHelper.reviewRequest(testHelper, issuanceRequestID.toString(), syndicateKP,
                    StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", undefined, 0, 24);
            })
            .then(() => done())
            .catch(helpers.errorHandler);
    });

    it("Update account from unverified to syndicate", function (done) {
        var newAccountKP = StellarSdk.Keypair.random();
        accountHelper.createNewAccount(testHelper, newAccountKP.accountId(), StellarSdk.xdr.AccountType.notVerified().value, 0)
            .then(() => {
                accountHelper.createNewAccount(testHelper, newAccountKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            })
            .then(() => done())
            .catch(err => done(err));
    });

    it("Create sale for asset", function (done) {
        var syndicateKP = StellarSdk.Keypair.random();
        var baseAsset = "BTC" + Math.floor(Math.random() * 1000);
        var quoteAsset = "USD" + Math.floor(Math.random() * 1000);
        var startTime = Math.round((new Date()).getTime() / 1000);
        var price = 4.5;
        var softCap = 2250;
        var hardCap = 4500;
        var maxIssuanceAmount = hardCap / price;
        var saleParticipantKP = StellarSdk.Keypair.random();
        var lowerParticipAmount = 1000;
        var saleAnteAmount = hardCap * 5 / 100;
        let saleID = 0;
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), baseAsset, 0, maxIssuanceAmount.toString(), maxIssuanceAmount.toString()))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), quoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, (hardCap + saleAnteAmount).toString(), (hardCap + saleAnteAmount).toString()))
            .then(() => feesHelper.setFees(testHelper, StellarSdk.xdr.FeeType.investFee(), "0", "5", quoteAsset))
            .then(() => saleHelper.createSale(testHelper, syndicateKP, baseAsset, quoteAsset, startTime + "", startTime + 60 * 10 + "", softCap.toString(), hardCap.toString(), [{
                    price: price.toString(),
                    asset: quoteAsset
                }], false, maxIssuanceAmount, StellarSdk.xdr.SaleState.promotion())
            )
            .then(requestID => saleHelper.cancelSaleCreationRequest(testHelper, syndicateKP, requestID))
            .then(() => saleHelper.createAndReviewSale(testHelper, syndicateKP, baseAsset, quoteAsset, startTime + "", startTime + 60 * 10 + "", softCap.toString(), hardCap.toString(), [{
                    price: price.toString(),
                    asset: quoteAsset
                }], false, maxIssuanceAmount, StellarSdk.xdr.SaleState.promotion())
            )
            .then(newSaleID => {
                saleID = newSaleID;
                return saleHelper.setSaleState(testHelper, saleID, StellarSdk.xdr.SaleState.none())
                    .then(() => saleHelper.createUpdateSaleDetailsRequest(testHelper, syndicateKP, saleID)
                    );
            })
            .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, ""))
            .then(() => saleHelper.createUpdateSaleEndTimeRequest(testHelper, syndicateKP, saleID, startTime + 120 * 10 + ""))
            .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, ""))
            .then(() => accountHelper.createNewAccount(testHelper, saleParticipantKP.accountId(), StellarSdk.xdr.AccountType.notVerified().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, saleParticipantKP, quoteAsset, testHelper.master, (hardCap + saleAnteAmount).toString()))
            .then(() => accountHelper.createBalanceForAsset(testHelper, saleParticipantKP, baseAsset))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, softCap.toString(), quoteAsset))
            .then(offerID => offerHelper.cancelSaleParticipation(testHelper, saleParticipantKP, baseAsset, quoteAsset, offerID))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, lowerParticipAmount.toString(), quoteAsset))
            .then(offerID => offerHelper.cancelSaleParticipation(testHelper, saleParticipantKP, baseAsset, quoteAsset, offerID))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, hardCap.toString(), quoteAsset))
            .then(() => saleHelper.checkSaleState(testHelper, baseAsset))
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });
    it("Fixed price sale with price < ONE", function (done) {
        var syndicateKP = StellarSdk.Keypair.random();
        var baseAsset = "BTC" + Math.floor(Math.random() * 1000);
        var quoteAsset = "USD" + Math.floor(Math.random() * 1000);
        var startTime = Math.round((new Date()).getTime() / 1000);
        var price = 0.5;
        var softCap = 5;
        var hardCap = 10;
        var maxIssuanceAmount = hardCap * 2;
        var saleParticipantKP = StellarSdk.Keypair.random();
        var lowerParticipAmount = 1;
        var saleAnteAmount = hardCap * 5 / 100;
        let saleID = 0;
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), baseAsset, 0, maxIssuanceAmount.toString(), maxIssuanceAmount.toString()))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), quoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, (hardCap + saleAnteAmount).toString(), (hardCap + saleAnteAmount).toString()))
            .then(() => feesHelper.setFees(testHelper, StellarSdk.xdr.FeeType.investFee(), "0", "5", quoteAsset))
            .then(() => saleHelper.createAndReviewSale(testHelper, syndicateKP, baseAsset, quoteAsset, startTime + "", startTime + 60 * 10 + "", softCap.toString(), hardCap.toString(), [{
                    price: price.toString(),
                    asset: quoteAsset
                }], 3, maxIssuanceAmount, StellarSdk.xdr.SaleState.promotion(), true)
            )
            .then(newSaleID => {
                saleID = newSaleID;
                return saleHelper.setSaleState(testHelper, saleID, StellarSdk.xdr.SaleState.none())
                    .then(() => saleHelper.createUpdateSaleDetailsRequest(testHelper, syndicateKP, saleID)
                    );
            })
            .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, ""))
            .then(() => saleHelper.createUpdateSaleEndTimeRequest(testHelper, syndicateKP, saleID, startTime + 120 * 10 + ""))
            .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, ""))
            .then(() => accountHelper.createNewAccount(testHelper, saleParticipantKP.accountId(), StellarSdk.xdr.AccountType.notVerified().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, saleParticipantKP, quoteAsset, testHelper.master, (hardCap + saleAnteAmount).toString()))
            .then(() => accountHelper.createBalanceForAsset(testHelper, saleParticipantKP, baseAsset))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, softCap.toString(), quoteAsset))
            .then(offerID => offerHelper.cancelSaleParticipation(testHelper, saleParticipantKP, baseAsset, quoteAsset, offerID))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, lowerParticipAmount.toString(), quoteAsset))
            .then(offerID => offerHelper.cancelSaleParticipation(testHelper, saleParticipantKP, baseAsset, quoteAsset, offerID))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, hardCap.toString(), quoteAsset))
            .then(() => saleHelper.checkSaleState(testHelper, baseAsset))
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    it("Fixed price sale with price > ONE", function (done) {
        var syndicateKP = StellarSdk.Keypair.random();
        var baseAsset = "BTC" + Math.floor(Math.random() * 1000);
        var quoteAsset = "USD" + Math.floor(Math.random() * 1000);
        var startTime = Math.round((new Date()).getTime() / 1000);
        var price = 13;
        var softCap = 13;
        var hardCap = 26;
        var maxIssuanceAmount = hardCap / price;
        var saleParticipantKP = StellarSdk.Keypair.random();
        var lowerParticipAmount = 0.1;
        var saleAnteAmount = hardCap * 5 / 100;
        let saleID = 0;
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), baseAsset, 0, maxIssuanceAmount.toString(), maxIssuanceAmount.toString()))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), quoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, (hardCap + saleAnteAmount).toString(), (hardCap + saleAnteAmount).toString()))
            .then(() => feesHelper.setFees(testHelper, StellarSdk.xdr.FeeType.investFee(), "0", "5", quoteAsset))
            .then(() => feesHelper.setFees(testHelper, StellarSdk.xdr.FeeType.capitalDeploymentFee(), "0", "1", quoteAsset))
            .then(() => saleHelper.createAndReviewSale(testHelper, syndicateKP, baseAsset, quoteAsset, startTime + "", startTime + 60 * 10 + "", softCap.toString(), hardCap.toString(), [{
                    price: price.toString(),
                    asset: quoteAsset
                }], 3, maxIssuanceAmount, StellarSdk.xdr.SaleState.promotion(), true)
            )
            .then(newSaleID => {
                saleID = newSaleID;
                return saleHelper.setSaleState(testHelper, saleID, StellarSdk.xdr.SaleState.none())
                    .then(() => saleHelper.createUpdateSaleDetailsRequest(testHelper, syndicateKP, saleID)
                    );
            })
            .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, ""))
            .then(() => saleHelper.createUpdateSaleEndTimeRequest(testHelper, syndicateKP, saleID, startTime + 120 * 10 + ""))
            .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, ""))
            .then(() => accountHelper.createNewAccount(testHelper, saleParticipantKP.accountId(), StellarSdk.xdr.AccountType.notVerified().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, saleParticipantKP, quoteAsset, testHelper.master, (hardCap + saleAnteAmount).toString()))
            .then(() => accountHelper.createBalanceForAsset(testHelper, saleParticipantKP, baseAsset))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, softCap.toString(), quoteAsset))
            .then(offerID => offerHelper.cancelSaleParticipation(testHelper, saleParticipantKP, baseAsset, quoteAsset, offerID))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, lowerParticipAmount.toString(), quoteAsset))
            .then(offerID => offerHelper.cancelSaleParticipation(testHelper, saleParticipantKP, baseAsset, quoteAsset, offerID))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, hardCap.toString(), quoteAsset))
            .then(() => saleHelper.checkSaleState(testHelper, baseAsset))
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });


    it("Offer partially matched", function (done) {
        let buyerKP = StellarSdk.Keypair.random();
        let sellerKP = StellarSdk.Keypair.random();
        let baseAsset = "USD" + Math.floor(Math.random() * 1000);
        let quoteAsset = "UAH" + Math.floor(Math.random() * 1000);
        let baseMaxIssuanceAmount = 101;
        let quoteMaxIssuanceAmount = 2601;

        assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), baseAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value,
            baseMaxIssuanceAmount.toString(), baseMaxIssuanceAmount.toString())
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), quoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value,
                quoteMaxIssuanceAmount.toString(), quoteMaxIssuanceAmount.toString()))
            .then(() => assetHelper.createAssetPair(testHelper, baseAsset, quoteAsset, "26", StellarSdk.xdr.AssetPairPolicy.tradeableSecondaryMarket().value))
            .then(() => accountHelper.createNewAccount(testHelper, sellerKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0))
            .then(() => accountHelper.createNewAccount(testHelper, buyerKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, sellerKP, baseAsset, testHelper.master, baseMaxIssuanceAmount.toString()))
            .then(() => issuanceHelper.fundAccount(testHelper, buyerKP, quoteAsset, testHelper.master, quoteMaxIssuanceAmount.toString()))
            .then(() => offerHelper.createOffer(testHelper, sellerKP, baseAsset, quoteAsset, "26", "30", false))
            .then(() => offerHelper.createOffer(testHelper, sellerKP, baseAsset, quoteAsset, "26", "50", false))
            .then(() => offerHelper.createOffer(testHelper, buyerKP, baseAsset, quoteAsset, "26", "100", true))
            .then(() => done())
            .catch(err => done(err));
    })

    it("Three offers taken by one", function (done) {
        let buyerKP = StellarSdk.Keypair.random();
        let sellerKP = StellarSdk.Keypair.random();
        let baseAsset = "USD" + Math.floor(Math.random() * 1000);
        let quoteAsset = "UAH" + Math.floor(Math.random() * 1000);
        let baseMaxIssuanceAmount = 101;
        let quoteMaxIssuanceAmount = 2601;

        assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), baseAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value,
            baseMaxIssuanceAmount.toString(), baseMaxIssuanceAmount.toString())
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), quoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value,
                quoteMaxIssuanceAmount.toString(), quoteMaxIssuanceAmount.toString()))
            .then(() => assetHelper.createAssetPair(testHelper, baseAsset, quoteAsset, "26", StellarSdk.xdr.AssetPairPolicy.tradeableSecondaryMarket().value))
            .then(() => accountHelper.createNewAccount(testHelper, sellerKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0))
            .then(() => accountHelper.createNewAccount(testHelper, buyerKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, sellerKP, baseAsset, testHelper.master, baseMaxIssuanceAmount.toString()))
            .then(() => issuanceHelper.fundAccount(testHelper, buyerKP, quoteAsset, testHelper.master, quoteMaxIssuanceAmount.toString()))
            .then(() => offerHelper.createOffer(testHelper, sellerKP, baseAsset, quoteAsset, "26", "20", false))
            .then(() => offerHelper.createOffer(testHelper, sellerKP, baseAsset, quoteAsset, "26", "30", false))
            .then(() => offerHelper.createOffer(testHelper, sellerKP, baseAsset, quoteAsset, "26", "50", false))
            .then(() => offerHelper.createOffer(testHelper, buyerKP, baseAsset, quoteAsset, "26", "100", true))
            .then(() => done())
            .catch(err => done(err));
    })

    it("Cancel sale manually", function (done) {
        var syndicateKP = StellarSdk.Keypair.random();
        var baseAsset = "BTC" + Math.floor(Math.random() * 10000);
        var quoteAsset = "USD" + Math.floor(Math.random() * 10000);
        var startTime = Math.round((new Date()).getTime() / 1000);
        var price = 4.5;
        var softCap = 2250;
        var hardCap = 4500;
        var maxIssuanceAmount = hardCap / price;
        var saleParticipantKP = StellarSdk.Keypair.random();
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), baseAsset, 0, maxIssuanceAmount.toString(), maxIssuanceAmount.toString()))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), quoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, (hardCap).toString(), (hardCap).toString()))
            .then(() => saleHelper.createAndReviewSale(testHelper, syndicateKP, baseAsset, quoteAsset, startTime + "", startTime + 60 * 10 + "", softCap.toString(), hardCap.toString(), [{
                price: price.toString(),
                asset: quoteAsset
            }], false, maxIssuanceAmount, StellarSdk.xdr.SaleState.promotion()))
            .then(saleID => saleHelper.cancelSale(testHelper, syndicateKP, saleID))
            .then(() => done())
            .catch(err => done(err));
    });

    it("Create and update sale with promotion state", function (done) {
        var syndicateKP = StellarSdk.Keypair.random();
        var baseAsset = "BTC" + Math.floor(Math.random() * 1000);
        var quoteAsset = "USD" + Math.floor(Math.random() * 1000);
        var startTime = Math.round((new Date()).getTime() / 1000);
        var price = 4.5;
        var softCap = 2250;
        var hardCap = 4500;
        var maxIssuanceAmount = hardCap / price;
        var saleParticipantKP = StellarSdk.Keypair.random();
        var newQuoteAsset = "EUR" + Math.floor(Math.random() * 1000);
        var newQuoteAssetPrice = 9;
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), baseAsset, 0, maxIssuanceAmount.toString(), maxIssuanceAmount.toString()))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), quoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, (hardCap).toString(), (hardCap).toString()))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), newQuoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, (hardCap).toString(), (hardCap).toString()))
            .then(() => assetHelper.createAssetPair(testHelper, quoteAsset, newQuoteAsset, "2"))
            .then(() => saleHelper.createAndReviewSale(testHelper, syndicateKP, baseAsset, quoteAsset, startTime + "", startTime + 60 * 10 + "", softCap.toString(), hardCap.toString(), [{
                price: price.toString(),
                asset: quoteAsset
            }], false, maxIssuanceAmount, StellarSdk.xdr.SaleState.promotion()))
            .then(saleID => saleHelper.createPromotionUpdateRequest(testHelper, syndicateKP, saleID, baseAsset, quoteAsset,
                startTime + "", startTime + 60 * 10 + "", softCap.toString(), hardCap.toString(), [
                    {
                        price: price.toString(),
                        asset: quoteAsset
                    },
                    {
                        price: newQuoteAssetPrice.toString(),
                        asset: newQuoteAsset
                    }
                ], false, maxIssuanceAmount, StellarSdk.xdr.SaleState.none()))
            .then(requestID => reviewableRequestHelper.reviewRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, ""))
            .then(() => done())
            .catch(err => done(err));
    });

    it("Create and update voting sale with master", function (done) {
        var syndicateKP = StellarSdk.Keypair.random();
        var baseAsset = "BTC" + Math.floor(Math.random() * 1000);
        var quoteAsset = "USD" + Math.floor(Math.random() * 1000);
        var startTime = Math.round((new Date()).getTime() / 1000);
        var price = 4.5;
        var softCap = 2250;
        var hardCap = 4500;
        var maxIssuanceAmount = hardCap / price;
        var saleParticipantKP = StellarSdk.Keypair.random();
        var newQuoteAsset = "EUR" + Math.floor(Math.random() * 1000);
        var newQuoteAssetPrice = 9;
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), baseAsset, 0, maxIssuanceAmount.toString(), maxIssuanceAmount.toString()))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), quoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, (hardCap).toString(), (hardCap).toString()))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), newQuoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, (hardCap).toString(), (hardCap).toString()))
            .then(() => assetHelper.createAssetPair(testHelper, quoteAsset, newQuoteAsset, "2"))
            .then(() => saleHelper.createAndReviewSale(testHelper, syndicateKP, baseAsset, quoteAsset, startTime + "", startTime + 60 * 10 + "", softCap.toString(), hardCap.toString(), [{
                price: price.toString(),
                asset: quoteAsset
            }], false, maxIssuanceAmount, StellarSdk.xdr.SaleState.voting()))
            .then(saleID => saleHelper.createPromotionUpdateRequest(testHelper, testHelper.master, saleID, baseAsset, quoteAsset,
                startTime + "", startTime + 60 * 10 + "", softCap.toString(), hardCap.toString(), [
                    {
                        price: price.toString(),
                        asset: quoteAsset
                    },
                    {
                        price: newQuoteAssetPrice.toString(),
                        asset: newQuoteAsset
                    }
                ], false, maxIssuanceAmount, StellarSdk.xdr.SaleState.none()))
            .then(() => done())
            .catch(err => done(err));
    });

    it("Create fundrasing for asset", function (done) {
        var syndicateKP = StellarSdk.Keypair.random();
        var baseAsset = "BTC" + Math.floor(Math.random() * 1000);
        var quoteAsset = "ETH" + Math.floor(Math.random() * 1000);
        var defaultQuoteAsset = "USD" + Math.floor(Math.random() * 1000);
        var startTime = Math.round((new Date()).getTime() / 1000);
        var price = 1;
        var softCap = 2250;
        var hardCap = 4500;
        var maxIssuanceAmount = hardCap * 2;
        var saleParticipantKP = StellarSdk.Keypair.random();
        var baseAssetForHardCap = hardCap;
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), baseAsset, 0, maxIssuanceAmount.toString(), maxIssuanceAmount.toString()))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), quoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, MAX_INT64_AMOUNT, MAX_INT64_AMOUNT))
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), defaultQuoteAsset, StellarSdk.xdr.AssetPolicy.baseAsset().value, MAX_INT64_AMOUNT, MAX_INT64_AMOUNT))
            .then(() => assetHelper.createAssetPair(testHelper, quoteAsset, defaultQuoteAsset, "1"))
            .then(() => saleHelper.createAndReviewSale(testHelper, syndicateKP, baseAsset, defaultQuoteAsset, startTime + "", startTime + 60 * 10 + "", softCap.toString(),
                hardCap.toString(), [{
                    price: price.toString(),
                    asset: quoteAsset
                }], true, baseAssetForHardCap.toString()))
            .then(() => accountHelper.createNewAccount(testHelper, saleParticipantKP.accountId(), StellarSdk.xdr.AccountType.notVerified().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, saleParticipantKP, quoteAsset, testHelper.master, MAX_INT64_AMOUNT))
            .then(() => accountHelper.createBalanceForAsset(testHelper, saleParticipantKP, baseAsset))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, undefined, quoteAsset, '0.000001'))
            .then(() => assetHelper.updateAssetPrice(testHelper, quoteAsset, defaultQuoteAsset, "0.000001"))
            .then(() => offerHelper.participateInSale(testHelper, saleParticipantKP, baseAsset, (hardCap / 0.000001).toString(), quoteAsset))
            // first not remove offers with 0 base amount
            .then(() => saleHelper.checkSaleState(testHelper, baseAsset))
            // close sale
            .then(() => saleHelper.checkSaleState(testHelper, baseAsset))
            .then(() => done())
            .catch(err => done(err));
    });

    it("Create asset and change preissuer", function (done) {
        var syndicateKP = StellarSdk.Keypair.random();
        var preissuerKP = StellarSdk.Keypair.random();
        var newPreissuerKP = StellarSdk.Keypair.random();
        var code = "MATOKEN" + Math.floor(Math.random() * 1000);
        console.log("Asset code: " + code);
        console.log("pre issuer: " + preissuerKP.accountId());
        var maxIssuance = "101001";
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, preissuerKP.accountId(), code, 0, maxIssuance, "0"))
            .then(() => accountHelper.addSuperAdmin(testHelper, syndicateKP.accountId(), syndicateKP, preissuerKP.accountId(), {
                weight: 255,
                type: StellarSdk.xdr.SignerType.txSender().value,
                identity: 1,
                name: "tx sender",
            }))
            .then(() => assetHelper.changePreIssuerSigner(testHelper, code, newPreissuerKP.accountId(), syndicateKP, preissuerKP))
            .then(() => accountHelper.addSuperAdmin(testHelper, syndicateKP.accountId(), syndicateKP, newPreissuerKP.accountId(), {
                weight: 255,
                type: StellarSdk.xdr.SignerType.txSender().value,
                identity: 1,
                name: "tx sender",
            }))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, newPreissuerKP, code, maxIssuance))
            .then(() => done())
            .catch(err => {
                done(err);
            });
    });

    it("Create referrer and two referrals", function (done) {
        let referrerKP = StellarSdk.Keypair.random();
        let firstReferralKP = StellarSdk.Keypair.random();
        let secondReferralKP = StellarSdk.Keypair.random();
        accountHelper.createNewAccount(testHelper, referrerKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0)
            .then(() => accountHelper.createNewAccount(testHelper, firstReferralKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0, referrerKP.accountId()))
            .then(() => accountHelper.createNewAccount(testHelper, secondReferralKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0, referrerKP.accountId()))
            .then(() => done())
            .catch(err => {
                done(err);
            })
    });

    it("Create KYC request and change KYC", function (done) {
        let newAccountKP = StellarSdk.Keypair.random();
        let requestID = "0";
        let kycLevel = 0;
        let kycData = {"hash": "bb36c7c58c4c32d98947c8781c91c7bb797c3647"};
        let kycRuleKey = kycHelper.makeKYCRuleKey(StellarSdk.xdr.AccountType.notVerified().value, StellarSdk.xdr.AccountType.general().value);
        let value = 123;
        accountHelper.createNewAccount(testHelper, newAccountKP.accountId(), StellarSdk.xdr.AccountType.notVerified().value, 0)
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, kycRuleKey, value))
            .then(() => kycHelper.createKYCRequest(testHelper, newAccountKP, requestID, newAccountKP.accountId(), StellarSdk.xdr.AccountType.general().value, kycLevel, kycData))
            .then(requestID => reviewableRequestHelper.reviewUpdateKYCRequest(testHelper, requestID, master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", 0, value, {}))
            .then(() => done())
            .catch(err => done(err));
    });

    it("Create AML alert and approve and reject", function (done) {
        var assetCode = "ETH" + Math.floor(Math.random() * 1000);

        var preIssuedAmount = "10000.000000";
        var syndicateKP = StellarSdk.Keypair.random();
        var newAccountKP = StellarSdk.Keypair.random();
        let amlAlertAmount = Number(preIssuedAmount) / 2;
        console.log("Creating new account for issuance " + syndicateKP.accountId());
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, 0))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, preIssuedAmount))
            .then(() => accountHelper.createNewAccount(testHelper, newAccountKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, newAccountKP, assetCode, syndicateKP, preIssuedAmount))
            .then(() => accountHelper.loadBalanceForAsset(testHelper, newAccountKP.accountId(), assetCode))
            .then(balance => {
                expect(balance.balance).to.be.equal(preIssuedAmount);
                return amlAlertHelper.createAMLAlert(testHelper, balance.balance_id, amlAlertAmount.toString())
            }).then(requestID => {
            return reviewableRequestHelper.reviewAmlAlertRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "",
                "Testing AML requests");
        }).then(() => accountHelper.loadBalanceForAsset(testHelper, newAccountKP.accountId(), assetCode))
            .then(balance => {
                expect(Number(balance.balance)).to.be.equal(amlAlertAmount);
                return amlAlertHelper.createAMLAlert(testHelper, balance.balance_id, amlAlertAmount.toString())
            }).then(requestID => {
            return reviewableRequestHelper.reviewAmlAlertRequest(testHelper, requestID, testHelper.master, StellarSdk.xdr.ReviewRequestOpAction.permanentReject().value, "Already processed",
                "Testing AML requests");
        }).then(() => accountHelper.loadBalanceForAsset(testHelper, newAccountKP.accountId(), assetCode))
            .then(balance => {
                expect(Number(balance.balance)).to.be.equal(amlAlertAmount);
                done();
            })
            .catch(err => {
                done(err)
            });
    });

    it("Perform cross asset payment V2", function (done) {
        var paymentAssetCode = "USD" + Math.floor(Math.random() * 1000);
        var feeAssetCode = "ETH" + Math.floor(Math.random() * 1000);
        var price = "5";
        var payerKP = StellarSdk.Keypair.random();
        var recipientKP = StellarSdk.Keypair.random();
        var sourceBalanceID;
        assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), paymentAssetCode,
            StellarSdk.xdr.AssetPolicy.baseAsset().value | StellarSdk.xdr.AssetPolicy.transferable().value |
            StellarSdk.xdr.AssetPolicy.statsQuoteAsset().value, "10000", "5000")
            .then(() => assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), feeAssetCode,
                StellarSdk.xdr.AssetPolicy.baseAsset().value, "10000", "5000"))
            .then(() => accountHelper.createNewAccount(testHelper, payerKP.accountId(), StellarSdk.xdr.AccountType.general().value))
            .then(() => accountHelper.createNewAccount(testHelper, recipientKP.accountId(), StellarSdk.xdr.AccountType.general().value))
            .then(() => assetHelper.createAssetPair(testHelper, paymentAssetCode, feeAssetCode, price))
            .then(() => feesHelper.setFees(testHelper, StellarSdk.xdr.FeeType.paymentFee(), "10", "10", paymentAssetCode, StellarSdk.xdr.PaymentFeeType.outgoing().value.toString(), false, feeAssetCode))
            .then(() => feesHelper.setFees(testHelper, StellarSdk.xdr.FeeType.paymentFee(), "5", "0", paymentAssetCode, StellarSdk.xdr.PaymentFeeType.incoming().value.toString(), false, paymentAssetCode))
            .then(() => issuanceHelper.fundAccount(testHelper, payerKP, paymentAssetCode, testHelper.master, "1000"))
            .then(() => issuanceHelper.fundAccount(testHelper, payerKP, feeAssetCode, testHelper.master, "1000"))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, payerKP.accountId(), paymentAssetCode))
            .then(balanceID => {
                sourceBalanceID = balanceID
            })
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, recipientKP.accountId(), paymentAssetCode))
            .then(balanceID => {
                return paymentV2Helper.paymentV2(testHelper, payerKP, sourceBalanceID, balanceID, "100", feeAssetCode, paymentAssetCode, true);
            })
            .then(() => assetHelper.updateAsset(testHelper, testHelper.master, testHelper.master.accountId(), paymentAssetCode,
                StellarSdk.xdr.AssetPolicy.baseAsset().value | StellarSdk.xdr.AssetPolicy.transferable().value))
            .then(() => done())
            .catch(err => done(err));
    });

    it("Creates, binds and delete pool entry", function (done) {
        let accountKP = StellarSdk.Keypair.random();
        let poolEntryId;
        let externalSystemType = Math.floor(Math.random() * 10) + 4;
        let data = "Some data" + Math.floor(Math.random() * 1000);
        let parent = Math.floor(Math.random() * 20);
        manageExternalSystemAccountIdPoolEntryHelper.createExternalSystemAccountIdPoolEntry(testHelper, externalSystemType, data, parent)
            .then(poolId => {
                poolEntryId = poolId;
                return accountHelper.createNewAccount(testHelper, accountKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0);
            })
            .then(() => bindExternalSystemAccountIdHelper.bindExternalSystemAccountId(testHelper, accountKP, externalSystemType))
            .then(() => manageExternalSystemAccountIdPoolEntryHelper.deleteExternalSystemAccountIdPoolEntry(testHelper, poolEntryId))
            .then(() => done())
            .catch(err => done(err));
    });

    it("Creates, change and delete key value", function (done) {
        let first_key = "123";
        let second_key = "222";
        let first_value = "1234";
        let second_value = "2222";
        manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, first_key, first_value)
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, second_key, second_value))
            .then(() => manageKeyValueHelper.deleteKeyValue(testHelper, testHelper.master, second_key))
            .then(() => done())
            .catch(err => done(err));
    });

    it("Create, remove and update limitsV2 for account", function (done) {
        var accountKP = StellarSdk.Keypair.random();
        var syndicateKP = StellarSdk.Keypair.random();
        var asset = "BTC" + Math.floor(Math.random() * 1000);
        let documentData = {"data" : "Some details"};
        var newLimits = {
            accountID: accountKP.accountId(),
            statsOpType: 3,
            assetCode: asset,
            isConvertNeeded: false,
            dailyOut: '100',
            weeklyOut: '200',
            monthlyOut: '300',
            annualOut: '500'
        };
        var limitsV2EntryID;

        accountHelper.createNewAccount(testHelper, accountKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0)
            .then(() => accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0))
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), asset, 0, "5000"))
            .then(() => manageLimitsHelper.createLimits(testHelper, testHelper.master, asset, accountKP.accountId()))
            .then(id => {
                limitsV2EntryID = id;
                return manageLimitsHelper.removeLimits(testHelper, testHelper.master, limitsV2EntryID);
            })
            .then(() => manageLimitsHelper.createLimits(testHelper, testHelper.master, asset, accountKP.accountId()))
            .then(id => {
                limitsV2EntryID = id;
                return limitsUpdateHelper.createLimitsUpdateRequest(testHelper, accountKP, documentData, "0");
            })
            .then(requestID => {
                return limitsUpdateHelper.createLimitsUpdateRequest(testHelper, accountKP, {"data" : "new data"}, requestID);
            })
            .then(requestID => {
                newLimits.id = limitsV2EntryID;
                setTimeout(() => {
                    return reviewableRequestHelper.reviewLimitsUpdateRequest(testHelper, requestID, master, StellarSdk.xdr.ReviewRequestOpAction.approve().value,
                        "", newLimits);
                }, 60000);
            })
            .then(() => done())
            .catch(helpers.errorHandler);
    });

    it("Create contract with invoices", function (done) {
        let assetCode = "PLN" + Math.floor(Math.random() * 10000);
        let contractorKP = StellarSdk.Keypair.random();
        let customerKP = StellarSdk.Keypair.random();
        let escrowKP = StellarSdk.Keypair.random();
        let details = {"contract_number" : "12"};
        let disputeReason = {"data" : "Invoice amount too much"};
        let startTime = "1234567";
        let endTime = "104608000000";
        let contractID;
        let firstInvoiceID;
        let secondInvoiceID;
        let sourceBalaceID;
        let destBalaceID;
        assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), assetCode, StellarSdk.xdr.AssetPolicy.baseAsset().value | StellarSdk.xdr.AssetPolicy.transferable().value, "10000", "5000")
            .then(() => accountHelper.createNewAccount(testHelper, customerKP.accountId(), StellarSdk.xdr.AccountType.general().value))
            .then(() => accountHelper.createNewAccount(testHelper, escrowKP.accountId(), StellarSdk.xdr.AccountType.general().value))
            .then(() => accountHelper.createNewAccount(testHelper, contractorKP.accountId(), StellarSdk.xdr.AccountType.general().value))
            .then(() => issuanceHelper.fundAccount(testHelper, customerKP, assetCode, testHelper.master, "5000"))
            .then(() => contractHelper.createContractRequest(testHelper, contractorKP, customerKP, escrowKP, details, startTime, endTime))
            .then(requestID => reviewableRequestHelper.reviewContractRequest(testHelper, requestID, customerKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", {"data" : "Everything is correct"}))
            .then(response => {
                let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
                contractID = result.result().results()[0].tr().reviewRequestResult().success().ext().contractId().toString();
                console.log("ContractID: " + contractID);
                return contractID ;
            })
            .then(() => manageInvoiceRequestHelper.createInvoiceRequest(testHelper, contractorKP, customerKP, assetCode, "300", {"data" : "Some details"}, contractID))
            .then(response => {
                firstInvoiceID = response.id;
                sourceBalaceID = response.sourceBalanceID;
                destBalaceID = response.destBalanceID;
                return reviewableRequestHelper.reviewInvoiceRequest(testHelper, firstInvoiceID, customerKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", sourceBalaceID, destBalaceID, "300", assetCode);
            })
            .then(() => manageInvoiceRequestHelper.createInvoiceRequest(testHelper, contractorKP, customerKP, assetCode, "300", {"data" : "Another details"}, contractID))
            .then(response => {
                secondInvoiceID = response.id;
                sourceBalaceID = response.sourceBalanceID;
                destBalaceID = response.destBalanceID;
                return reviewableRequestHelper.reviewInvoiceRequest(testHelper, secondInvoiceID, customerKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", sourceBalaceID, destBalaceID, "300", assetCode);
            })
            .then(() => contractHelper.addDetails(testHelper, contractorKP, contractID, details))
            .then(() => contractHelper.addDetails(testHelper, customerKP, contractID, details))
            .then(() => manageInvoiceRequestHelper.createInvoiceRequest(testHelper, contractorKP, customerKP, assetCode, "200", {"data" : "Other details"}, contractID))
            .then(response => manageInvoiceRequestHelper.removeInvoiceRequest(testHelper, contractorKP, response.id))
            .then(() => contractHelper.confirmCompleted(testHelper, contractorKP, contractID))
            .then(() => contractHelper.startDispute(testHelper, customerKP, contractID, disputeReason))
            .then(() => contractHelper.addDetails(testHelper, escrowKP, contractID, details))
            .then(() => contractHelper.confirmCompleted(testHelper, customerKP, contractID))
            .then(() => contractHelper.createContractRequest(testHelper, contractorKP, customerKP, escrowKP, details, startTime, endTime))
            .then(requestID => reviewableRequestHelper.reviewContractRequest(testHelper, requestID, customerKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", {"data" : "Everything is correct"}))
            .then(response => {
                let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
                contractID = result.result().results()[0].tr().reviewRequestResult().success().ext().contractId().toString();
                console.log("ContractID: " + contractID);
                return contractID ;
            })
            .then(() => contractHelper.addDetails(testHelper, contractorKP, contractID, details))
            .then(() => contractHelper.addDetails(testHelper, customerKP, contractID, details))
            .then(() => manageInvoiceRequestHelper.createInvoiceRequest(testHelper, contractorKP, customerKP, assetCode, "300", {"data" : "Some details"}, contractID))
            .then(response => {
                firstInvoiceID = response.id;
                sourceBalaceID = response.sourceBalanceID;
                destBalaceID = response.destBalanceID;
                return reviewableRequestHelper.reviewInvoiceRequest(testHelper, firstInvoiceID, customerKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value, "", sourceBalaceID, destBalaceID, "300", assetCode);
            })
            .then(() => contractHelper.confirmCompleted(testHelper, customerKP, contractID))
            .then(() => contractHelper.startDispute(testHelper, contractorKP, contractID, disputeReason))
            .then(() => contractHelper.addDetails(testHelper, escrowKP, contractID, details))
            .then(() => contractHelper.resolveDispute(testHelper, escrowKP, contractID, false))
            .then(() => done())
            .catch(helpers.errorHandler);
    });

    it("Create and remove invoice request", function (done) {
        let assetCode = "PLN" + Math.floor(Math.random() * 10000);
        let payerKP = StellarSdk.Keypair.random();
        let recipientKP = StellarSdk.Keypair.random();
        let destinationBalanceID;
        let details = {"data" : "Some details"};
        let firstRequestID;
        let secondRequestID;
        let thirdRequestID;
        assetHelper.createAsset(testHelper, testHelper.master, testHelper.master.accountId(), assetCode,
                StellarSdk.xdr.AssetPolicy.baseAsset().value, "10000", "5000")
            .then(() => accountHelper.createNewAccount(testHelper, payerKP.accountId(), StellarSdk.xdr.AccountType.general().value))
            .then(() => accountHelper.createNewAccount(testHelper, recipientKP.accountId(), StellarSdk.xdr.AccountType.general().value))
            .then(() => accountHelper.loadBalanceIDForAsset(testHelper, recipientKP.accountId(), assetCode))
            .then(balanceID => {
                destinationBalanceID = balanceID;
                return manageInvoiceRequestHelper.createInvoiceRequest(testHelper, recipientKP, payerKP, assetCode, "100", details);
            })
            .then(response => {
                firstRequestID = response.id;
                return reviewableRequestHelper.reviewInvoiceRequest(testHelper, firstRequestID, payerKP, StellarSdk.xdr.ReviewRequestOpAction.permanentReject().value, "Behavior suspiciously", destinationBalanceID, destinationBalanceID, "1", assetCode);
            })
            .then(() => manageInvoiceRequestHelper.createInvoiceRequest(testHelper, recipientKP, payerKP, assetCode, "200", {"data" : "Other details"}))
            .then(response => {
                secondRequestID = response.id;
                return manageInvoiceRequestHelper.removeInvoiceRequest(testHelper, recipientKP, secondRequestID);
            })
            .then(() => manageInvoiceRequestHelper.createInvoiceRequest(testHelper, recipientKP, payerKP, assetCode, "300", {"data" : "Another details"}))
            .then(response => {
                thirdRequestID = response.id;
                return reviewableRequestHelper.loadRequestWithRetry(testHelper, firstRequestID, testHelper.master);
            })
            .then(request => {
                expect(request.request_state).to.be.equal("permanently_rejected");
                return reviewableRequestHelper.loadRequestWithRetry(testHelper, secondRequestID, testHelper.master);
            })
            .then(request => {
                expect(request.request_state).to.be.equal("canceled");
                return reviewableRequestHelper.loadRequestWithRetry(testHelper, thirdRequestID, testHelper.master);
            })
            .then(request => {
                expect(request.request_state).to.be.equal("pending");
                return request;
            })
            .then(() => done())
            .catch(err => done(err));
    });

    it("Withdrawal KeyValue lower bound", function (done) {
        let issuanceRequestID;
        var assetCode = "USD" + Math.floor(Math.random() * 1000);
        var assetPolicy = StellarSdk.xdr.AssetPolicy.transferable().value | StellarSdk.xdr.AssetPolicy.withdrawable().value | StellarSdk.xdr.AssetPolicy.twoStepWithdrawal().value;
        var preIssuedAmount = "1.000000";
        var syndicateKP = StellarSdk.Keypair.random();
        var newAccountKP = StellarSdk.Keypair.random();
        let lowerBound = {
            key:"WithdrawLowerBound:"+assetCode,
            value: "10000",
            entryType: StellarSdk.xdr.KeyValueEntryType.uint64().value
        };

        console.log("Creating new account for issuance " + syndicateKP.accountId());
        accountHelper.createNewAccount(testHelper, syndicateKP.accountId(), StellarSdk.xdr.AccountType.syndicate().value, 0)
            .then(() => assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), assetCode, assetPolicy))
            .then(() => manageKeyValueHelper.putKeyValue(testHelper, testHelper.master, lowerBound.key, lowerBound.value, lowerBound.entryType))
            .then(kv => helpers.tx.waitForTX(testHelper, kv.hash))
            .then(() => issuanceHelper.performPreIssuance(testHelper, syndicateKP, syndicateKP, assetCode, preIssuedAmount))
            .then(() => accountHelper.createNewAccount(testHelper, newAccountKP.accountId(), StellarSdk.xdr.AccountType.general().value, 0))
            .then(() => issuanceHelper.fundAccount(testHelper, newAccountKP, assetCode, syndicateKP, preIssuedAmount))
            .then(() => accountHelper.loadBalanceForAsset(testHelper, newAccountKP.accountId(), assetCode))
            .then(balance => {
                expect(balance.balance).to.be.equal(preIssuedAmount);

            })
            // withdraw all the assets available with auto conversion to BTC
            .then(() => {
                let autoConversionAsset = "BTC" + Math.floor(Math.random() * 1000);
                return assetHelper.createAsset(testHelper, syndicateKP, syndicateKP.accountId(), autoConversionAsset, 0)
                    .then(() => assetHelper.createAssetPair(testHelper, assetCode, autoConversionAsset))
                    .then(() => accountHelper.loadBalanceIDForAsset(testHelper, newAccountKP.accountId(), assetCode))
                    .then(balanceID => {
                        return withdrawHelper.withdraw(testHelper, newAccountKP, balanceID, preIssuedAmount, autoConversionAsset);
                    })
                    .then(requestID => {
                        return reviewableRequestHelper.reviewTwoStepWithdrawRequest(testHelper, requestID, syndicateKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value,
                            "", {two_step_details: "Updated two step external details"}).then(() => {
                            return reviewableRequestHelper.reviewWithdrawRequest(testHelper, requestID, syndicateKP, StellarSdk.xdr.ReviewRequestOpAction.approve().value,
                                "", {one_step_withdrawal: "Updated external details"}, StellarSdk.xdr.ReviewableRequestType.withdraw().value);
                        });
                    });
            })
            .then(() => done())
            .catch(err => {
                console.log(err);
                done(err);
            });
    });
});
