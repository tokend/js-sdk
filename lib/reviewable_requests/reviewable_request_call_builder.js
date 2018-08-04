"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("../call_builder").CallBuilder;

var ReviewableRequestCallBuilder = exports.ReviewableRequestCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link ReviewableRequestCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use ReviewableRequests subclasses.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function ReviewableRequestCallBuilder(serverUrl) {
        _classCallCheck(this, ReviewableRequestCallBuilder);

        _get(Object.getPrototypeOf(ReviewableRequestCallBuilder.prototype), "constructor", this).call(this, serverUrl);
    }

    _inherits(ReviewableRequestCallBuilder, _CallBuilder);

    _createClass(ReviewableRequestCallBuilder, {
        reviewableRequest: {

            /**
             * Provides information on a single reviewable request. Note: does not check request type.
             * @param id Reviewable request ID
             * @returns {LedgerCallBuilder}
             */

            value: function reviewableRequest(id) {
                this.filter.push(["requests", id.toString()]);
                return this;
            }
        },
        forReviewer: {

            /**
             * Filters reviewable requests by reviewer
             * @param {string} reviewer For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
             * @returns {ReviewableRequestCallBuilder}
             */

            value: function forReviewer(reviewer) {
                this.url.addQuery("reviewer", reviewer);
                return this;
            }
        },
        forRequestor: {

            /**
             * Filters reviewable requests by requestor
             * @param {string} requestor For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
             * @returns {ReviewableRequestCallBuilder}
             */

            value: function forRequestor(requestor) {
                this.url.addQuery("requestor", requestor);
                return this;
            }
        },
        forState: {

            /**
             * Filters reviewable requests by state
             * @param {number} state For example: Pending: 1, Canceled: 2, Approved: 3, Rejected: 4, PermanentlyRejected: 5
             * @returns {ReviewableRequestCallBuilder}
             */

            value: function forState(state) {
                this.url.addQuery("state", state);
                return this;
            }
        },
        forType: {
            value: function forType(requestType) {
                this.url.addQuery("request_type", requestType);
                return this;
            }
        }
    });

    return ReviewableRequestCallBuilder;
})(CallBuilder);