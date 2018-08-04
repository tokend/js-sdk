"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var PaymentRequestCallBuilder = exports.PaymentRequestCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link PaymentRequestRequestCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#paymentRequests}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function PaymentRequestCallBuilder(serverUrl) {
        _classCallCheck(this, PaymentRequestCallBuilder);

        _get(Object.getPrototypeOf(PaymentRequestCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("payment_requests");
    }

    _inherits(PaymentRequestCallBuilder, _CallBuilder);

    _createClass(PaymentRequestCallBuilder, {
        paymentsOnly: {
            value: function paymentsOnly() {
                this.url.addQuery("request_type", 2);
                return this;
            }
        },
        paymentRequest: {
            value: function paymentRequest(requestId) {
                this.filter.push(["payment_requests", requestId]);
                return this;
            }
        },
        forAccount: {
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
            value: function forExchange(accountId) {
                this.url.addQuery("exchange", accountId);
                return this;
            }
        },
        forState: {

            /**
             * This endpoint represents all PaymentRequest that were included in valid transactions with state.
             * @param {int} state 1:PENDING, 2:ACCEPTED, 3:REJECTED
             * @returns {PaymentRequestCallBuilder}
             */

            value: function forState(state) {
                this.url.addQuery("state", state);
                return this;
            }
        }
    });

    return PaymentRequestCallBuilder;
})(CallBuilder);