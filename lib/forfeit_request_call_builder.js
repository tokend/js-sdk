"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var ForfeitRequestCallBuilder = exports.ForfeitRequestCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link ForfeitRequestRequestCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#forfeitRequests}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function ForfeitRequestCallBuilder(serverUrl) {
        _classCallCheck(this, ForfeitRequestCallBuilder);

        _get(Object.getPrototypeOf(ForfeitRequestCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("forfeit_requests");
    }

    _inherits(ForfeitRequestCallBuilder, _CallBuilder);

    _createClass(ForfeitRequestCallBuilder, {
        forfeitRequest: {

            /**
             * The ForfeitRequest details endpoint provides information on a single ForfeitRequest. The request ID provided in the id
             * argument specifies which request to load.
             * @see [Operation Details](https://www.stellar.org/developers/horizon/reference/operations-single.html)
             * @param {number} operationId Operation ID
             * @returns {OperationCallBuilder}
             */

            value: function forfeitRequest(requestId) {
                this.filter.push(["payment_requests", requestId]);
                return this;
            }
        },
        forAccount: {

            /**
             * This endpoint represents all forfeit requests that were included in valid transactions that affected a particular account.
             * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
             * @returns {OperationCallBuilder}
             */

            value: function forAccount(accountId) {
                this.url.addQuery("target_account", accountId);
                return this;
            }
        },
        forBalance: {

            // forExchange or forAccount should be set

            value: function forBalance(balanceId) {
                this.url.addQuery("target_balance", balanceId);
                return this;
            }
        },
        forExchange: {
            value: function forExchange(exchangeId) {
                this.url.addQuery("exchange", exchangeId);
                return this;
            }
        },
        forState: {

            /**
             * This endpoint represents all ForfeitRequest that were included in valid transactions with state.
             * @param {int} state 1:PENDING, 2:ACCEPTED, 3:REJECTED
             * @returns {OperationCallBuilder}
             */

            value: function forState(state) {
                this.url.addQuery("state", state);
                return this;
            }
        }
    });

    return ForfeitRequestCallBuilder;
})(CallBuilder);