"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var TransactionCallBuilder = exports.TransactionCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link TransactionCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#transactions}.
     * @see [All Transactions](https://www.stellar.org/developers/horizon/reference/transactions-all.html)
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function TransactionCallBuilder(serverUrl) {
        _classCallCheck(this, TransactionCallBuilder);

        _get(Object.getPrototypeOf(TransactionCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("transactions");
    }

    _inherits(TransactionCallBuilder, _CallBuilder);

    _createClass(TransactionCallBuilder, {
        transaction: {

            /**
             * The transaction details endpoint provides information on a single transaction. The transaction hash provided in the hash argument specifies which transaction to load.
             * @see [Transaction Details](https://www.stellar.org/developers/horizon/reference/transactions-single.html)
             * @param {string} transactionId Transaction ID
             * @returns {TransactionCallBuilder}
             */

            value: function transaction(transactionId) {
                this.filter.push(["transactions", transactionId]);
                return this;
            }
        },
        forAccount: {

            /**
             * This endpoint represents all transactions that affected a given account.
             * @see [Transactions for Account](https://www.stellar.org/developers/horizon/reference/transactions-for-account.html)
             * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
             * @returns {TransactionCallBuilder}
             */

            value: function forAccount(accountId) {
                if (accountId !== undefined && typeof accountId.accountId === "function") {
                    accountId = accountId.accountId();
                }
                this.filter.push(["accounts", accountId, "transactions"]);
                return this;
            }
        },
        pending: {

            /**
             * @param {object} Options for pending transactions filter
             */

            value: function pending(_ref) {
                var state = _ref.state;
                var signedBy = _ref.signedBy;
                var notSignedBy = _ref.notSignedBy;

                // TODO validate signedBy and notSignedBy not set simultaneously
                if (state !== undefined) {
                    // 1 - pending
                    // 3 - reject
                    this.url.addQuery("state", state);
                }

                if (signedBy !== undefined) {
                    if (typeof signedBy.accountId === "function") {
                        signedBy = signedBy.accountId();
                    }
                    this.url.addQuery("signed_by", signedBy);
                }

                if (notSignedBy !== undefined) {
                    if (typeof notSignedBy.accountId === "function") {
                        notSignedBy = notSignedBy.accountId();
                    }
                    this.url.addQuery("not_signed_by", notSignedBy);
                }

                this.url.addQuery("pending", true);
                return this;
            }
        },
        forLedger: {

            /**
             * This endpoint represents all transactions in a given ledger.
             * @see [Transactions for Ledger](https://www.stellar.org/developers/horizon/reference/transactions-for-ledger.html)
             * @param {number} ledgerId Ledger ID
             * @returns {TransactionCallBuilder}
             */

            value: function forLedger(ledgerId) {
                this.filter.push(["ledgers", ledgerId, "transactions"]);
                return this;
            }
        }
    });

    return TransactionCallBuilder;
})(CallBuilder);