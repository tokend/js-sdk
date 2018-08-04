"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var WithdrawalCallBuilder = exports.WithdrawalCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link WithdrawalCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#withdrawals}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function WithdrawalCallBuilder(serverUrl) {
        _classCallCheck(this, WithdrawalCallBuilder);

        _get(Object.getPrototypeOf(WithdrawalCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("request/withdrawals");
    }

    _inherits(WithdrawalCallBuilder, _CallBuilder);

    _createClass(WithdrawalCallBuilder, {
        forDestAsset: {

            /**
             * Filters withdrawals by destination asset.
             * @param {string} asset For example: `BTC`
             * @returns {WithdrawalCallBuilder}
             */

            value: function forDestAsset(asset) {
                this.url.addQuery("to_asset", asset);
                return this;
            }
        },
        forRequester: {

            /**
             * Filters withdrawals by requester.
             * @param {string} requester For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
             * @returns {WithdrawalCallBuilder}
             */

            value: function forRequester(requester) {
                this.url.addQuery("requester", requester);
                return this;
            }
        },
        forState: {

            /**
             * Filters withdrawals by state.
             * @param {number} state For example: Pending: 1, Canceled: 2, Approved: 3, Rejected: 4, PermanentlyRejected: 5
             * @returns {WithdrawalCallBuilder}
             */

            value: function forState(state) {
                this.url.addQuery("state", state);
                return this;
            }
        }
    });

    return WithdrawalCallBuilder;
})(CallBuilder);