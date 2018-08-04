"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var UserCallBuilder = exports.UserCallBuilder = (function (_CallBuilder) {
    function UserCallBuilder(serverUrl) {
        _classCallCheck(this, UserCallBuilder);

        _get(Object.getPrototypeOf(UserCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("users");
    }

    _inherits(UserCallBuilder, _CallBuilder);

    _createClass(UserCallBuilder, {
        approved: {
            value: function approved() {
                this.url.addQuery("status", "approved");
                return this;
            }
        },
        regRequests: {
            value: function regRequests() {
                this.url.addQuery("status", "reg_requests");
                return this;
            }
        },
        limitIncreaseRequests: {
            value: function limitIncreaseRequests() {
                this.url.addQuery("status", "limit_requests");
                return this;
            }
        },
        accountId: {
            value: function accountId(id) {
                this.filter.push(["users", id]);
                return this;
            }
        },
        disabled: {
            value: function disabled() {
                this.url.addQuery("status", "blocked");
                return this;
            }
        },
        status: {
            value: (function (_status) {
                var _statusWrapper = function status(_x) {
                    return _status.apply(this, arguments);
                };

                _statusWrapper.toString = function () {
                    return _status.toString();
                };

                return _statusWrapper;
            })(function (status) {
                this.url.addQuery("status", status);
                return this;
            })
        }
    });

    return UserCallBuilder;
})(CallBuilder);