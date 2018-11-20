"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var BaseKeyValue = require("tokend-js-base/src/key_value").KeyValue;

var forIn = _interopRequire(require("lodash/forIn"));

var key_value_response = exports.key_value_response = (function () {
    function key_value_response(response) {
        var _this = this;

        _classCallCheck(this, key_value_response);

        this._baseKeyValue = new BaseKeyValue(response.key);
        // Extract response fields
        forIn(response, function (value, key) {
            _this[key] = value;
        });
    }

    _createClass(key_value_response, {
        keyValueKey: {
            value: function keyValueKey() {
                return this._baseKeyValue.keyValueKey();
            }
        }
    });

    return key_value_response;
})();
