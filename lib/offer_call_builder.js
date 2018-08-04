"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var OfferCallBuilder = exports.OfferCallBuilder = (function (_CallBuilder) {
    function OfferCallBuilder(serverUrl) {
        _classCallCheck(this, OfferCallBuilder);

        _get(Object.getPrototypeOf(OfferCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("offers");
    }

    _inherits(OfferCallBuilder, _CallBuilder);

    _createClass(OfferCallBuilder, {
        forAccount: {
            value: function forAccount(accountId) {
                this.filter.push(["accounts", accountId, "offers"]);
                return this;
            }
        },
        assetPair: {
            value: function assetPair(baseAsset, quoteAsset) {
                this.url.addQuery("base_asset", baseAsset);
                this.url.addQuery("quote_asset", quoteAsset);
                return this;
            }
        },
        isBuy: {
            value: (function (_isBuy) {
                var _isBuyWrapper = function isBuy() {
                    return _isBuy.apply(this, arguments);
                };

                _isBuyWrapper.toString = function () {
                    return _isBuy.toString();
                };

                return _isBuyWrapper;
            })(function () {
                var isBuy = arguments[0] === undefined ? false : arguments[0];

                this.url.addQuery("is_buy", isBuy);
                return this;
            })
        },
        orderBookID: {
            value: (function (_orderBookID) {
                var _orderBookIDWrapper = function orderBookID(_x) {
                    return _orderBookID.apply(this, arguments);
                };

                _orderBookIDWrapper.toString = function () {
                    return _orderBookID.toString();
                };

                return _orderBookIDWrapper;
            })(function (orderBookID) {
                this.url.addQuery("order_book_id", orderBookID);
                return this;
            })
        },
        onlyPrimary: {
            value: (function (_onlyPrimary) {
                var _onlyPrimaryWrapper = function onlyPrimary(_x2) {
                    return _onlyPrimary.apply(this, arguments);
                };

                _onlyPrimaryWrapper.toString = function () {
                    return _onlyPrimary.toString();
                };

                return _onlyPrimaryWrapper;
            })(function (onlyPrimary) {
                this.url.addQuery("only_primary", onlyPrimary);
                return this;
            })
        }
    });

    return OfferCallBuilder;
})(CallBuilder);