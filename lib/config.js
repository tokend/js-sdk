"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var clone = _interopRequire(require("lodash/clone"));

var defaultConfig = {
  allowHttp: false,
  serverURLPrefix: []
};

var config = clone(defaultConfig);

/**
 * Global config class.
 *
 * Usage node:
 * ```
 * import {Config} from 'stellar-sdk';
 * Config.setAllowHttp(true);
 * ```
 *
 * Usage browser:
 * ```
 * StellarSdk.Config.setAllowHttp(true);
 * ```
 * @static
 */

var Config = (function () {
  function Config() {
    _classCallCheck(this, Config);
  }

  _createClass(Config, null, {
    setAllowHttp: {
      /**
       * Sets `allowHttp` flag globally. When set to `true`, connections to insecure http protocol servers will be allowed.
       * Must be set to `false` in production. Default: `false`.
       * @param {boolean} value
       * @static
       */

      value: function setAllowHttp(value) {
        config.allowHttp = value;
      }
    },
    isAllowHttp: {

      /**
       * Returns the value of `allowHttp` flag.
       * @static
       */

      value: function isAllowHttp() {
        return clone(config.allowHttp);
      }
    },
    setDefault: {

      /**
       * Sets all global config flags to default values.
       * @static
       */

      value: function setDefault() {
        config = clone(defaultConfig);
      }
    },
    setURLPrefix: {

      /**
       * Sets `serverURLPrefix` globally. When set StellarSdk.CallBuilder will add this prefix
       * for each request to Horizon. Example:
       * `http://horizon.io/some/path` -> `http://horizon.io/my/pref/some/path`
       * @param {string} value - for example `/my/pref`
       * @static
       */

      value: function setURLPrefix(value) {
        config.serverURLPrefix = value.split("/").filter(function (s) {
          return s !== "";
        });
      }
    },
    getURLPrefix: {

      /**
       * Returns the value of `serverURLPrefix`.
       * @static
       */

      value: function getURLPrefix() {
        return config.serverURLPrefix;
      }
    },
    getURLPrefixedPath: {

      /**
       * Returns the value of `serverURLPrefix`.
       * @param {string} value - for example `/my/pref`
       * @static
       */

      value: function getURLPrefixedPath(value) {
        var path = value.split("/").filter(function (s) {
          return s !== "";
        });
        return config.serverURLPrefix.concat(path.filter(function (item) {
          return config.serverURLPrefix.indexOf(item) < 0;
        }));
      }
    },
    isURLPrefix: {

      /**
       * Returns the true if `serverURLPrefix` not empty.
       * @static
       */

      value: function isURLPrefix() {
        return config.serverURLPrefix.length > 0;
      }
    }
  });

  return Config;
})();

exports.Config = Config;