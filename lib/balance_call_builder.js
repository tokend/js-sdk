"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var BalanceCallBuilder = exports.BalanceCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link BalanceCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#balances}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function BalanceCallBuilder(serverUrl) {
        _classCallCheck(this, BalanceCallBuilder);

        _get(Object.getPrototypeOf(BalanceCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("balances");
    }

    _inherits(BalanceCallBuilder, _CallBuilder);

    _createClass(BalanceCallBuilder, {
        forAccount: {
            value: function forAccount(accountId) {
                this.url.addQuery("account", accountId);
                return this;
            }
        },
        balanceId: {
            value: (function (_balanceId) {
                var _balanceIdWrapper = function balanceId(_x) {
                    return _balanceId.apply(this, arguments);
                };

                _balanceIdWrapper.toString = function () {
                    return _balanceId.toString();
                };

                return _balanceIdWrapper;
            })(function (balanceId) {
                this.filter.push(["balances", balanceId, "asset"]);
                return this;
            })
        },
        forAsset: {
            value: function forAsset(asset) {
                this.url.addQuery("asset", asset);
                return this;
            }
        },
        account: {
            value: function account(balanceId) {
                this.filter.push(["balances", balanceId, "account"]);
                return this;
            }
        },
        assetHolders: {

            /**
             * This endpoint represents balances filtered by asset code
             * @param {string} like USD
             * @returns {AssetCallBuilder}
             */

            value: function assetHolders(assetCode) {
                this.filter.push(["assets", assetCode, "holders"]);
                return this;
            }
        }
    });

    return BalanceCallBuilder;
})(CallBuilder);