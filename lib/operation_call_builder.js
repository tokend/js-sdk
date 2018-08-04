"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var OperationCallBuilder = exports.OperationCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link OperationCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#operations}.
     * @see [All Operations](https://www.stellar.org/developers/horizon/reference/operations-all.html)
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function OperationCallBuilder(serverUrl) {
        _classCallCheck(this, OperationCallBuilder);

        _get(Object.getPrototypeOf(OperationCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("operations");
    }

    _inherits(OperationCallBuilder, _CallBuilder);

    _createClass(OperationCallBuilder, {
        operation: {

            /**
             * The operation details endpoint provides information on a single operation. The operation ID provided in the id
             * argument specifies which operation to load.
             * @see [Operation Details](https://www.stellar.org/developers/horizon/reference/operations-single.html)
             * @param {number} operationId Operation ID
             * @returns {OperationCallBuilder}
             */

            value: function operation(operationId) {
                this.filter.push(["operations", operationId]);
                return this;
            }
        },
        forAccount: {

            /**
             * This endpoint represents all operations that were included in valid transactions that affected a particular account.
             * @see [Operations for Account](https://www.stellar.org/developers/horizon/reference/operations-for-account.html)
             * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
             * @returns {OperationCallBuilder}
             */

            value: function forAccount(accountId) {
                this.filter.push(["accounts", accountId, "operations"]);
                return this;
            }
        },
        forBalance: {
            value: function forBalance(balanceId, accountId) {
                this.url.addQuery("balance_id", balanceId);
                this.url.addQuery("account_id", accountId);
                return this;
            }
        },
        forLedger: {

            /**
             * This endpoint returns all operations that occurred in a given ledger.
             *
             * @see [Operations for Ledger](https://www.stellar.org/developers/horizon/reference/operations-for-ledger.html)
             * @param {number} ledgerId Ledger ID
             * @returns {OperationCallBuilder}
             */

            value: function forLedger(ledgerId) {
                this.filter.push(["ledgers", ledgerId, "operations"]);
                return this;
            }
        },
        forTransaction: {

            /**
             * This endpoint represents all operations that are part of a given transaction.
             * @see [Operations for Transaction](https://www.stellar.org/developers/horizon/reference/operations-for-transaction.html)
             * @param {string} transactionId Transaction ID
             * @returns {OperationCallBuilder}
             */

            value: function forTransaction(transactionId) {
                this.filter.push(["transactions", transactionId, "operations"]);
                return this;
            }
        }
    });

    return OperationCallBuilder;
})(CallBuilder);