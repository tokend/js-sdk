"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var BaseAccount = require("tokend-js-base").Account;

var forIn = _interopRequire(require("lodash/forIn"));

var AccountResponse = exports.AccountResponse = (function () {
    /**
     * Do not create this object directly, use {@link Server#loadAccount}.
     *
     * Returns information and links relating to a single account.
     * The balances section in the returned JSON will also list all the trust lines this account has set up.
     * It also contains {@link Account} object and exposes it's methods so can be used in {@link TransactionBuilder}.
     *
     * @see [Account Details](https://www.stellar.org/developers/horizon/reference/accounts-single.html)
     * @param {string} response Response from horizon account endpoint.
     * @returns {AccountResponse}
     */

    function AccountResponse(response) {
        var _this = this;

        _classCallCheck(this, AccountResponse);

        this._baseAccount = new BaseAccount(response.account_id);
        // Extract response fields
        forIn(response, function (value, key) {
            _this[key] = value;
        });
    }

    _createClass(AccountResponse, {
        accountId: {

            /**
             * Returns Stellar account ID, ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`
             * @returns {string}
             */

            value: function accountId() {
                return this._baseAccount.accountId();
            }
        }
    });

    return AccountResponse;
})();