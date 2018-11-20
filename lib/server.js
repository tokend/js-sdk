"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var AccountCallBuilder = require("./account_call_builder").AccountCallBuilder;

var AccountResponse = require("./account_response").AccountResponse;

var AssetCallBuilder = require("./asset_call_builder").AssetCallBuilder;

var AssetPairCallBuilder = require("./asset_pair_call_builder").AssetPairCallBuilder;

var AtomicSwapBidCallBuilder = require("./atomic_swap_bid_call_builder").AtomicSwapBidCallBuilder;

var BalanceCallBuilder = require("./balance_call_builder").BalanceCallBuilder;

var ContactsCallBuilder = require("./contacts_call_builder").ContactsCallBuilder;

var ContactRequestCallBuilder = require("./contact_request_call_builder").ContactRequestCallBuilder;

var DefaultLimitsCallBuilder = require("./default_limits_call_builder").DefaultLimitsCallBuilder;

var DocumentCallBuilder = require("./document_call_builder").DocumentCallBuilder;

var FeeCallBuilder = require("./fee_call_builder").FeeCallBuilder;

var FeesOverviewCallBuilder = require("./fees_overview_call_builder").FeesOverviewCallBuilder;

var ForfeitRequestCallBuilder = require("./forfeit_request_call_builder").ForfeitRequestCallBuilder;

var LedgerCallBuilder = require("./ledger_call_builder").LedgerCallBuilder;

var NotificationsCallBuilder = require("./notifications_call_builder").NotificationsCallBuilder;

var OfferCallBuilder = require("./offer_call_builder").OfferCallBuilder;

var OperationCallBuilder = require("./operation_call_builder").OperationCallBuilder;

var OrderBookCallBuilder = require("./order_book_call_builder").OrderBookCallBuilder;

var PaymentCallBuilder = require("./payment_call_builder").PaymentCallBuilder;

var PaymentRequestCallBuilder = require("./payment_request_call_builder").PaymentRequestCallBuilder;

var PriceCallBuilder = require("./price_call_builder").PriceCallBuilder;

var PublicInfoCallBuilder = require("./public_info_call_builder").PublicInfoCallBuilder;

var RecoveryRequestCallBuilder = require("./recovery_request_call_builder").RecoveryRequestCallBuilder;

var TradeCallBuilder = require("./trade_call_builder").TradeCallBuilder;

var TransactionCallBuilder = require("./transaction_call_builder").TransactionCallBuilder;

var UserCallBuilder = require("./user_call_builder").UserCallBuilder;

var SalesCallBuilder = require("./sales_call_builder").SalesCallBuilder;

var SaleAntesCallBuilder = require("./sale_antes_call_builder").SaleAntesCallBuilder;

var ContractCallBuilder = require("./contract_call_builder").ContractCallBuilder;

var Config = require("./config").Config;

var ReviewableRequestsHelper = require("./reviewable_requests/reviewable_requests_helper").ReviewableRequestsHelper;

var TimeSyncer = require("./time-syncer").TimeSyncer;

var _tokendJsBase = require("tokend-js-base");

var Account = _tokendJsBase.Account;
var hash = _tokendJsBase.hash;
var Operation = _tokendJsBase.Operation;
var xdr = _tokendJsBase.xdr;

var stellarBase = _interopRequire(_tokendJsBase);

var isUndefined = _interopRequire(require("lodash/isUndefined"));

var constants = _interopRequire(require("./const"));

var KeyValueCallBuilder = require("./key_value_call_builder").KeyValueCallBuilder;

var axios = require("axios");
var toBluebird = require("bluebird").resolve;
var URI = require("urijs");
var querystring = require("querystring");

var Server = exports.Server = (function () {
    /**
     * Server handles the network connection to a [Horizon](https://www.stellar.org/developers/horizon/learn/index.html)
     * instance and exposes an interface for requests to that instance.
     * @constructor
     * @param {string} serverURL Horizon Server URL (ex. `https://horizon-testnet.stellar.org`).
     * @param {object} [opts]
     * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments! You can also use {@link Config} class to set this globally.
     * @param {boolean} [opts.currentTimestamp] - Current times derived somewhere higher, need for time syncing with backend
     */

    function Server(serverURL) {
        var opts = arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Server);

        this.serverURL = URI(serverURL);
        try {
            Config.setURLPrefix(this.serverURL.path());
            // it is necessary to delete the prefix after saving for the correct signature,
            // the prefix will be added before the call
            this.serverURL.segment([]);
        } catch (err) {
            console.log(err);
        }

        this.currentTime = +opts.currentTimestamp || new Date().getTime();
        // we need to create singleton's instance here, otherwise it will be created in call builder,
        // that doesn't know anything about current time
        new TimeSyncer(this.currentTime);

        var allowHttp = Config.isAllowHttp();
        if (typeof opts.allowHttp !== "undefined") {
            allowHttp = opts.allowHttp;
        }

        if (this.serverURL.protocol() != "https" && !allowHttp) {
            throw new Error("Cannot connect to insecure horizon server");
        }
    }

    _createClass(Server, {
        submitOperation: {

            /**
             * Create {@link Base.Transaction} and submit to the Horizon server.
             *
             * @param {Base.Operation} op - The operation to submit.
             * @param {string} sourceID - The accountID of the transaction initiator (source).
             * @param {Base.Keypair} signerKP - The keypair of the source account signer.
             * @return {Promise}
             */

            value: function submitOperation(op, sourceID, signerKP) {
                var multiSigTx = arguments[3] === undefined ? false : arguments[3];

                console.warn("DeprecationWarning: submitOperation is deprecated. Consider using submitOperationGroup instead");
                var source = new stellarBase.Account(sourceID);
                var tx = new stellarBase.TransactionBuilder(source).addOperation(op).build();
                tx.sign(signerKP);
                if (!!multiSigTx) {
                    return this.submitTransaction(tx, multiSigTx, signerKP);
                }
                return this.submitTransaction(tx);
            }
        },
        submitOperationGroup: {

            /**
             * Create {@link Base.Transaction} and submit to the Horizon server.
             *
             * @param {Array} operations - The operation to submit.
             * @param {string} sourceID - The accountID of the transaction initiator (source).
             * @param {Base.Keypair} signerKP - The keypair of the source account signer.
             * @return {Promise}
             */

            value: function submitOperationGroup(operations, sourceID, signerKP) {
                var maxTotalFee = arguments[3] === undefined ? "0" : arguments[3];

                var source = new stellarBase.Account(sourceID);
                var transactionBuilder = new stellarBase.TransactionBuilder(source);
                operations.forEach(function (operation) {
                    return transactionBuilder.addOperation(operation);
                });
                transactionBuilder.addMaxTotalFee(maxTotalFee);
                var transaction = transactionBuilder.build();
                transaction.sign(signerKP);
                return this.submitTransaction(transaction);
            }
        },
        submitTransaction: {

            /**
             * Submit transaction to the Horizon server.
             *
             * @param {Base.Transaction} transaction - The transaction to submit.
             * @return {Promise}
             */

            value: function submitTransaction(transaction, multiSigTx, keypair) {
                // proper call is submitTransactions(tx),
                // backend will handle pending flow auto-magically.
                if (multiSigTx !== undefined) {
                    console.error("DeprecationWarning: multiSigTx is deprecated");
                }
                if (keypair !== undefined) {
                    console.error("DeprecationWarning: keypair is deprecated");
                }
                var path = "transactions";
                var tx = transaction.toEnvelope().toXDR().toString("base64");

                var config = {
                    timeout: constants.SUBMIT_TRANSACTION_TIMEOUT,
                    headers: {
                        "content-type": "application/json" }
                };

                var repeatDetails = {
                    config: config,
                    tx: tx
                };

                var promise = axios.post(this._getURL(path), { tx: tx }, config).then(function (response) {
                    return response.data;
                })["catch"](function (error) {
                    if (error instanceof Error) {
                        var details = error.response;
                        if (!isUndefined(details) && details.status === 403) {
                            error.repeatDetails = repeatDetails;
                        }
                        return Promise.reject(error);
                    }
                    return Promise.reject(error.data);
                });
                return toBluebird(promise);
            }
        },
        repeatTransaction: {
            value: function repeatTransaction(config, tx) {
                var path = "transactions";

                var promise = axios.post(this._getURL(path), { tx: tx }, config).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(response.data);
                    }
                });
                return toBluebird(promise);
            }
        },
        "public": {

            /**
             * Returns new {@link PublicInfoCallBuilder} object configured by a current Horizon server configuration.
             * @returns {PublicInfoCallBuilder}
             */

            value: function _public() {
                return new PublicInfoCallBuilder(URI(this.serverURL));
            }
        },
        accounts: {

            /**
             * Returns new {@link AccountCallBuilder} object configured by a current Horizon server configuration.
             * @returns {AccountCallBuilder}
             */

            value: function accounts() {
                return new AccountCallBuilder(URI(this.serverURL));
            }
        },
        atomic_swap_bids: {
            value: function atomic_swap_bids() {
                return new AtomicSwapBidCallBuilder(URI(this.serverURL));
            }
        },
        keyValues: {

            /**
             * Returns new {@link KeyValueCallBuilder} object configured by a current Horizon server configuration.
             * @returns {KeyValueCallBuilder}
             */

            value: function keyValues() {
                return new KeyValueCallBuilder(URI(this.serverURL));
            }
        },
        contacts: {

            /**
             * Returns new {@link ContactsCallBuilder} object configured by a current Horizon server configuration.
             * @returns {ContactsCallBuilder}
             */

            value: function contacts() {
                return new ContactsCallBuilder(URI(this.serverURL));
            }
        },
        contactRequests: {

            /**
             * Returns new {@link ContactRequestCallBuilder} object configured by a current Horizon server configuration.
             * @returns {ContactRequestCallBuilder}
             */

            value: function contactRequests() {
                return new ContactRequestCallBuilder(URI(this.serverURL));
            }
        },
        ledgers: {

            /**
             * Returns new {@link LedgerCallBuilder} object configured by a current Horizon server configuration.
             * @returns {LedgerCallBuilder}
             */

            value: function ledgers() {
                return new LedgerCallBuilder(URI(this.serverURL));
            }
        },
        sales: {

            /**
             * Returns new {@link SalesCallBuilder} object configured by a current Horizon server configuration.
             * @returns {SalesCallBuilder}
             */

            value: function sales() {
                return new SalesCallBuilder(URI(this.serverURL));
            }
        },
        sale_antes: {

            /**
             * Returns new {@link SaleAntesCallBuilder} object configured by a current Horizon server configuration.
             * @returns {SaleAntesCallBuilder}
             */

            value: function sale_antes() {
                return new SaleAntesCallBuilder(URI(this.serverURL));
            }
        },
        reviewableRequestsHelper: {

            /**
             * Returns new {@link ReviewableRequestsHelper} helper object to build specific reviewable requests call builders
             * @returns {ReviewableRequestCallBuilder}
             */

            value: function reviewableRequestsHelper() {
                return new ReviewableRequestsHelper(URI(this.serverURL));
            }
        },
        transactions: {

            /**
             * Returns new {@link TransactionCallBuilder} object configured by a current Horizon server configuration.
             * @returns {TransactionCallBuilder}
             */

            value: function transactions() {
                return new TransactionCallBuilder(URI(this.serverURL));
            }
        },
        operations: {

            /**
             * Returns new {@link OperationCallBuilder} object configured by a current Horizon server configuration.
             * @returns {OperationCallBuilder}
             */

            value: function operations() {
                return new OperationCallBuilder(URI(this.serverURL));
            }
        },
        forfeitRequests: {

            /**
             * Returns new {@link ForfeitRequestCallBuilder} object configured with the current Horizon server configuration.
             * @returns {ForfeitRequestCallBuilder}
             */

            value: function forfeitRequests() {
                return new ForfeitRequestCallBuilder(URI(this.serverURL));
            }
        },
        recoveryRequests: {

            /**
             * Returns new {@link RecoveryRequestCallBuilder} object configured with the current Horizon server configuration.
             * @returns {RecoveryRequestCallBuilder}
             */

            value: function recoveryRequests() {
                return new RecoveryRequestCallBuilder(URI(this.serverURL));
            }
        },
        paymentRequests: {

            /**
             * Returns new {@link PaymentRequestCallBuilder} object configured with the current Horizon server configuration.
             * @returns {PaymentRequestCallBuilder}
             */

            value: function paymentRequests() {
                return new PaymentRequestCallBuilder(URI(this.serverURL));
            }
        },
        assets: {

            /**
             * Returns new {@link AssetCallBuilder} object configured with the current Horizon server configuration.
             * @returns {AssetCallBuilder}
             */

            value: function assets() {
                return new AssetCallBuilder(URI(this.serverURL));
            }
        },
        assetPairs: {

            /**
             * Returns new {@link AssetPairCallBuilder} object configured with the current Horizon server configuration.
             * @returns {AssetPairCallBuilder}
             */

            value: function assetPairs() {
                return new AssetPairCallBuilder(URI(this.serverURL));
            }
        },
        balances: {

            /**
             * Returns new {@link BalanceCallBuilder} object configured with the current Horizon server configuration.
             * @returns {BalanceCallBuilder}
             */

            value: function balances() {
                return new BalanceCallBuilder(URI(this.serverURL));
            }
        },
        orderBooks: {

            /**
             * Returns new {@link OrderBookCallBuilder} object configured with the current Horizon server configuration.
             * @returns {OrderBookCallBuilder}
             */

            value: function orderBooks() {
                return new OrderBookCallBuilder(URI(this.serverURL));
            }
        },
        offers: {

            /**
             * Returns new {@link OfferCallBuilder} object configured with the current Horizon server configuration.
             * @returns {OfferCallBuilder}
             */

            value: function offers() {
                return new OfferCallBuilder(URI(this.serverURL));
            }
        },
        notifications: {

            /**
             * Returns new {@link NotificationsCallBuilder} object configured with the current Horizon server configuration.
             * @returns {NotificationsCallBuilder}
             */

            value: function notifications() {
                return new NotificationsCallBuilder(URI(this.serverURL));
            }
        },
        trades: {

            /**
             * Returns new {@link TradeCallBuilder} object configured with the current Horizon server configuration.
             * @returns {TradeCallBuilder}
             */

            value: function trades() {
                return new TradeCallBuilder(URI(this.serverURL));
            }
        },
        prices: {

            /**
             * Returns new {@link PriceCallBuilder} object configured with the current Horizon server configuration.
             * @returns {PriceCallBuilder}
             */

            value: function prices() {
                return new PriceCallBuilder(URI(this.serverURL));
            }
        },
        payments: {

            /**
             * Returns new {@link PaymentCallBuilder} object configured with the current Horizon server configuration.
             * @returns {PaymentCallBuilder}
             */

            value: function payments() {
                return new PaymentCallBuilder(URI(this.serverURL));
            }
        },
        users: {

            /**
             * Returns new {@link UserCallBuilder} object configured with the current Horizon server configuration.
             * @returns {UserCallBuilder}
             */

            value: function users() {
                return new UserCallBuilder(URI(this.serverURL));
            }
        },
        fees: {

            /**
            * Returns new {@link FeeCallBuilder} object configured with the current Horizon server configuration.
            * @returns {FeeCallBuilder}
            */

            value: function fees() {
                return new FeeCallBuilder(URI(this.serverURL));
            }
        },
        feesOverview: {

            /**
            * Returns new {@link FeesOverviewCallBuilder} object configured with the current Horizon server configuration.
            * @returns {FeesOverviewCallBuilder}
            */

            value: function feesOverview() {
                return new FeesOverviewCallBuilder(URI(this.serverURL));
            }
        },
        defaultLimits: {

            /**
             * Returns new {@link DefaultLimitsCallBuilder} object configured with the current Horizon server configuration.
             * @returns {DefaultLimitsCallBuilder}
             */

            value: function defaultLimits() {
                return new DefaultLimitsCallBuilder(URI(this.serverURL));
            }
        },
        documents: {

            /**
             * Returns new {@link DocumentCallBuilder} object configured with the current Horizon server configuration.
             * @returns {DocumentCallBuilder}
             */

            value: function documents() {
                return new DocumentCallBuilder(URI(this.serverURL));
            }
        },
        contracts: {

            /**
             * Returns new {@link ContractCallBuilder} object configured with the current Horizon server configuration.
             * @returns {ContractCallBuilder}
             */

            value: function contracts() {
                return new ContractCallBuilder(URI(this.serverURL));
            }
        },
        loadAccount: {

            /**
             * Fetches an account's most current state in the ledger and then creates and returns an {@link Account} object.
             * @param {string} accountId - The account to load.
             * @returns {Promise} Returns a promise to the {@link AccountResponse} object with populated sequence number.
             */

            value: function loadAccount(accountId) {
                return this.accounts().accountId(accountId).call().then(function (res) {
                    return new AccountResponse(res);
                });
            }
        },
        loadKeyValue: {
            value: function loadKeyValue(key) {
                return this.keyValues().keyValueByKey(key).call().then(function (res) {
                    return new key_value_response(res);
                });
            }
        },
        loadAccountWithSign: {
            /**
             * Fetches an account's most current state in the ledger and then creates and returns an {@link Account} object.
             * @param {string} accountId - The account to load.
             * @param {Keypair} keypair - The keypair for signing the request.
             * @returns {Promise} Returns a promise to the {@link AccountResponse} object with populated sequence number.
             */

            value: function loadAccountWithSign(accountId, keypair) {
                return this.accounts().accountId(accountId).callWithSignature(keypair).then(function (res) {
                    return new AccountResponse(res);
                });
            }
        },
        approveRegistration: {

            /* User POST Requests to the Horizon */
            // TODO: Add JsDoc

            value: function approveRegistration(userData, transaction, keypair) {
                var tx = "";
                if (transaction !== "") tx = transaction.toEnvelope().toXDR().toString("base64");

                userData.tx = tx;
                return this._sendUserPostRequest(userData, "users/approve", keypair);
            }
        },
        rejectPendingTransaction: {
            value: function rejectPendingTransaction(txHash, keypair) {
                var endpoint = "/transactions/" + txHash;
                var config = this._getConfig(endpoint, keypair);
                config.headers["content-type"] = "application/json";
                var promise = axios.patch(this._getURL(endpoint), { state: 3 }, config).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(response.data);
                    }
                });
                return toBluebird(promise);
            }
        },
        deletePendingTransaction: {
            value: function deletePendingTransaction(txHash, keypair) {
                var endpoint = "/transactions/" + txHash;
                var config = this._getConfig(endpoint, keypair);
                config.headers["content-type"] = "application/json";
                var promise = axios["delete"](this._getURL(endpoint), config).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(response.data);
                    }
                });
                return toBluebird(promise);
            }
        },
        createUser: {
            value: function createUser(params, keypair) {
                var prefix = "users/create";
                return this._sendUserPostRequest(params, prefix, keypair);
            }
        },
        updateUser: {
            value: function updateUser(params, keypair) {
                var prefix = "users/update";
                return this._sendUserPostRequest(params, prefix, keypair);
            }
        },
        sendDocs: {

            /**
             * Store user verification document
             * @param {object} params.
             * @param {string} params.accountId - Source account.
             * @param {string} params.type - Type of the document.
             * @param {string} params.name - File name.
             * @param {string} params.file - DataUrl encoded file.
             * @returns {Promise} Returns a promise.
             */

            value: function sendDocs(params, keypair) {
                var prefix = "users/" + params.accountId + "/documents/" + params.type;
                return this._sendUserPostRequest(params, prefix, keypair);
            }
        },
        deleteWallet: {
            value: function deleteWallet(username, keypair) {
                var prefix = "users/unverified/delete";
                return this._sendUserPostRequest({ username: username }, prefix, keypair);
            }
        },
        resendToken: {
            value: function resendToken(username, keypair) {
                var prefix = "users/unverified/resend_token";
                return this._sendUserPostRequest({ username: username }, prefix, keypair);
            }
        },
        addContact: {

            /**
             * Store user verification document
             * @param {object} params
             * @param {string} params.userId - AccountId of the source.
             * @param {string} params.account_id - AccountId of the contact.
             * @param {string} params.nickname - Pretty name for `params.counterpartyId`.
             * @returns {Promise} Returns a promise.
             */

            value: function addContact(params, keypair) {
                var prefix = "users/" + params.userId + "/contacts";
                var config = this._getConfig("/" + prefix, keypair);
                var promise = axios.post(this._getURL(prefix), querystring.stringify(params), config).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(response.data);
                    }
                });
                return toBluebird(promise);
            }
        },
        updateContact: {

            /**
             * Store user verification document
             * @param {object} params
             * @param {string} params.userId - AccountId of the source.
             * @param {string} params.contactId - Id of the contact.
             * @param {string} params.account_id - AccountId of the contact.
             * @param {string} params.nickname - Name of the contact.
             * @returns {Promise} Returns a promise.
             */

            value: function updateContact(params, keypair) {
                var prefix = "users/" + params.userId + "/contacts/" + params.account_id;
                var config = this._getConfig("/" + prefix, keypair);
                var promise = axios.patch(this._getURL(prefix), querystring.stringify(params), config).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(response.data);
                    }
                });
                return toBluebird(promise);
            }
        },
        deleteContact: {

            /**
             * Store user verification document
             * @param {object} params
             * @param {string} params.userId - AccountId of the source.
             * @param {string} params.contactId - Id of the contact.
             * @returns {Promise} Returns a promise.
             */

            value: function deleteContact(params, keypair) {
                var prefix = "users/" + params.userId + "/contacts/" + params.contactId;
                var config = this._getConfig("/" + prefix, keypair);
                var promise = axios["delete"](this._getURL(prefix), config).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(response.data);
                    }
                });
                return toBluebird(promise);
            }
        },
        sendContactRequest: {
            value: function sendContactRequest(params, keypair) {
                var requestData = { email: params.email };
                var prefix = "users/" + params.account_id + "/contacts/requests";
                var config = this._getConfig("/" + prefix, keypair);
                config.headers["Content-Type"] = "application/json";
                var promise = axios.post(this._getURL(prefix), requestData, config).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(response.data);
                    }
                });
                return toBluebird(promise);
            }
        },
        updateContactRequest: {
            value: function updateContactRequest(params, keypair) {
                var requestData = { state: params.state };
                var prefix = "users/" + params.account_id + "/contacts/requests/" + params.request_id;
                var config = this._getConfig("/" + prefix, keypair);
                config.headers["Content-Type"] = "application/json";
                var promise = axios.patch(this._getURL(prefix), requestData, config).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(response.data);
                    }
                });
                return toBluebird(promise);
            }
        },
        _sendUserPostRequest: {
            value: function _sendUserPostRequest(params, prefix, keypair) {
                var isJson = arguments[3] === undefined ? false : arguments[3];

                var requestData = {};
                var config = this._getConfig("/" + prefix, keypair);
                if (isJson) {
                    config.headers["Content-Type"] = "application/json";
                    requestData = params;
                } else {
                    requestData = querystring.stringify(params);
                }

                var promise = axios.post(this._getURL(prefix), requestData, config).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(response.data);
                    }
                });
                return toBluebird(promise);
            }
        },
        _getConfig: {
            value: function _getConfig(address, keypair) {
                var validUntil = Math.floor(new TimeSyncer(this.currentTime).now() + constants.SIGNATURE_VALID_SEC).toString();
                //temporary. should be fixed or refactored
                var signatureBase = "{ uri: '" + address + "', valid_untill: '" + validUntil.toString() + "'}";
                keypair = stellarBase.Keypair.fromRawSeed(keypair._secretSeed);
                var data = hash(signatureBase);

                var signature = keypair.signDecorated(data);
                return {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "X-AuthValidUnTillTimestamp": validUntil.toString(),
                        "X-AuthPublicKey": keypair.accountId(),
                        "X-AuthSignature": signature.toXDR("base64")
                    },
                    timeout: constants.SUBMIT_TRANSACTION_TIMEOUT
                };
            }
        },
        _getURL: {
            value: function _getURL(prefix) {
                var filters = [prefix];
                if (Config.isURLPrefix() === true) {
                    filters = Config.getURLPrefixedPath(prefix);
                }

                return URI(this.serverURL).segment(filters).toString();
            }
        }
    });

    return Server;
})();