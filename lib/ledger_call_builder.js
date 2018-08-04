"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var LedgerCallBuilder = exports.LedgerCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link LedgerCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#ledgers}.
     * @see [All Ledgers](https://www.stellar.org/developers/horizon/reference/ledgers-all.html)
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function LedgerCallBuilder(serverUrl) {
        _classCallCheck(this, LedgerCallBuilder);

        _get(Object.getPrototypeOf(LedgerCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("ledgers");
    }

    _inherits(LedgerCallBuilder, _CallBuilder);

    _createClass(LedgerCallBuilder, {
        ledger: {

            /**
             * Provides information on a single ledger.
             * @param sequence Ledger sequence
             * @returns {LedgerCallBuilder}
             */

            value: function ledger(sequence) {
                this.filter.push(["ledgers", sequence.toString()]);
                return this;
            }
        }
    });

    return LedgerCallBuilder;
})(CallBuilder);