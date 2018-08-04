"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var ReviewableRequestCallBuilder = require("./reviewable_request_call_builder").ReviewableRequestCallBuilder;

var UpdateKYCRequestCallBuilder = exports.UpdateKYCRequestCallBuilder = (function (_ReviewableRequestCallBuilder) {
    /**
     * Creates a new {@link UpdateKYCRequestCallBuilder} pointed to server defined by serverUrl
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#update_kyc}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function UpdateKYCRequestCallBuilder(serverUrl) {
        _classCallCheck(this, UpdateKYCRequestCallBuilder);

        _get(Object.getPrototypeOf(UpdateKYCRequestCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("request/update_kyc");
    }

    _inherits(UpdateKYCRequestCallBuilder, _ReviewableRequestCallBuilder);

    _createClass(UpdateKYCRequestCallBuilder, {
        forAccount: {

            /**
             * Filters KYC changing
             * @param {string} updated_account_id For example: `GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB`
             * @returns {UpdateKYCRequestCallBuilder}
             */

            value: function forAccount(updated_account_id) {
                this.url.addQuery("account_to_update_kyc", updated_account_id);
                return this;
            }
        }
    });

    return UpdateKYCRequestCallBuilder;
})(ReviewableRequestCallBuilder);