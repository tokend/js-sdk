"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
var instance = null;

/**
 * Is needed for time syncing with backend. It solves the problem when incorrect time on user's device lead to signature
 * expiration.
 */

var TimeSyncer = exports.TimeSyncer = (function () {
  /**
   * Constructs a new instance only in case it doesn't exist, otherwise returns previously created
   * @param {number} timestamp - valid timestamp preferred to use in signatures validUntil.
   * @return {TimeSyncer}
   */

  function TimeSyncer(timestamp) {
    _classCallCheck(this, TimeSyncer);

    if (!instance) {
      this._diff = this._local() - timestamp;
      instance = this;
    }
    return instance;
  }

  _createClass(TimeSyncer, {
    now: {

      /**
       * Returns valid timestamp synced with server time
       * @return {number}
       */

      value: function now() {
        return this._local() - this._diff;
      }
    },
    _local: {

      /**
       * Returns timestamp that is set in users device
       * @return {number}
       * @private
       */

      value: function _local() {
        return new Date().getTime() / 1000;
      }
    }
  });

  return TimeSyncer;
})();