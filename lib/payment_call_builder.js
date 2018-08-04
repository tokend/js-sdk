"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var PaymentCallBuilder = exports.PaymentCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link PaymentCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#payments}.
     * @see [All Payments](https://www.stellar.org/developers/horizon/reference/payments-all.html)
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function PaymentCallBuilder(serverUrl) {
        _classCallCheck(this, PaymentCallBuilder);

        _get(Object.getPrototypeOf(PaymentCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("payments");
    }

    _inherits(PaymentCallBuilder, _CallBuilder);

    _createClass(PaymentCallBuilder, {
        forAccount: {

            /**
             * This endpoint responds with a collection of Payment operations where the given account was either the sender or receiver.
             * @see [Payments for Account](https://www.stellar.org/developers/horizon/reference/payments-for-account.html)
             * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
             * @returns {PaymentCallBuilder}
             */

            value: function forAccount(accountId) {
                this.filter.push(["accounts", accountId, "payments"]);
                return this;
            }
        },
        forLedger: {

            /**
             * This endpoint represents all payment operations that are part of a valid transactions in a given ledger.
             * @see [Payments for Ledger](https://www.stellar.org/developers/horizon/reference/payments-for-ledger.html)
             * @param {number} ledgerId Ledger ID
             * @returns {PaymentCallBuilder}
             */

            value: function forLedger(ledgerId) {
                this.filter.push(["ledgers", ledgerId, "payments"]);
                return this;
            }
        },
        forTransaction: {

            /**
             * This endpoint represents all payment operations that are part of a given transaction.
             * @see [Payments for Transaction](https://www.stellar.org/developers/horizon/reference/payments-for-transaction.html)
             * @param {string} transactionId Transaction ID
             * @returns {PaymentCallBuilder}
             */

            value: function forTransaction(transactionId) {
                this.filter.push(["transactions", transactionId, "payments"]);
                return this;
            }
        },
        forExchange: {
            value: function forExchange(exchangeId) {
                this.url.addQuery("exchange_id", exchangeId);
                return this;
            }
        },
        forAsset: {
            value: function forAsset(asset) {
                this.url.addQuery("asset", asset);
                return this;
            }
        },
        forReference: {
            value: function forReference(reference) {
                this.url.addQuery("reference", reference);
                return this;
            }
        },
        сompletedOnly: {
            value: function ompletedOnly() {
                this.url.addQuery("completed_only", true);
                return this;
            }
        },
        sinceDate: {
            value: function sinceDate(date) {
                this.url.addQuery("since", date);
                return this;
            }
        },
        toDate: {
            value: function toDate(date) {
                this.url.addQuery("to", date);
                return this;
            }
        }
    });

    return PaymentCallBuilder;
})(CallBuilder);