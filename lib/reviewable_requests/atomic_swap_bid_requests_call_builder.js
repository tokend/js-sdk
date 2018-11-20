"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var ReviewableRequestCallBuilder = require("./reviewable_request_call_builder").ReviewableRequestCallBuilder;

var AtomicSwapBidCreationRequestsCallBuilder = exports.AtomicSwapBidCreationRequestsCallBuilder = (function (_ReviewableRequestCallBuilder) {
    /**
     * Creates a new {@link AtomicSwapBidCreationRequestsCallBuilder}
     * pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use
     * {@link Server#reviewableRequestsHelper#atomic_swap_bids}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function AtomicSwapBidCreationRequestsCallBuilder(serverUrl) {
        _classCallCheck(this, AtomicSwapBidCreationRequestsCallBuilder);

        _get(Object.getPrototypeOf(AtomicSwapBidCreationRequestsCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("request/atomic_swap_bids");
    }

    _inherits(AtomicSwapBidCreationRequestsCallBuilder, _ReviewableRequestCallBuilder);

    return AtomicSwapBidCreationRequestsCallBuilder;
})(ReviewableRequestCallBuilder);