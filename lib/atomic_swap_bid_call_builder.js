"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var AtomicSwapBidCallBuilder = exports.AtomicSwapBidCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link AtomicSwapBidCallBuilder}
     * pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#atomic_swap_bid}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function AtomicSwapBidCallBuilder(serverUrl) {
        _classCallCheck(this, AtomicSwapBidCallBuilder);

        _get(Object.getPrototypeOf(AtomicSwapBidCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("atomic_swap_bids");
    }

    _inherits(AtomicSwapBidCallBuilder, _CallBuilder);

    _createClass(AtomicSwapBidCallBuilder, {
        bid: {

            /**
             * Provides information on a single atomic swap bid.
             * @param {string} id Contract ID
             * @returns {AtomicSwapBidCallBuilder}
             */

            value: function bid(id) {
                this.filter.push(["atomic_swap_bids", id.toString()]);
                return this;
            }
        },
        forOwner: {

            /**
             * This endpoint represents atomic swap bids filters them by owner id
             * @param {string} accountID like `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
             * @returns {AtomicSwapBidCallBuilder}
             */

            value: function forOwner(accountID) {
                this.url.addQuery("owner_id", accountID);
                return this;
            }
        },
        forBaseAsset: {

            /**
             * This endpoint represents atomic swap bids filters them by base asset
             * @param {string} assetCode like `DL_TICKETS`
             * @returns {AtomicSwapBidCallBuilder}
             */

            value: function forBaseAsset(assetCode) {
                this.url.addQuery("base_asset", assetCode);
                return this;
            }
        }
    });

    return AtomicSwapBidCallBuilder;
})(CallBuilder);