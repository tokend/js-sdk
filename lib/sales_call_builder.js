"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var SalesCallBuilder = exports.SalesCallBuilder = (function (_CallBuilder) {
  /**
   * Creates a new {@link SalesCallBuilder} pointed to server defined by serverUrl.
   *
   * Do not create this object directly, use {@link Server#sales}.
   * @constructor
   * @extends CallBuilder
   * @param {string} serverUrl Horizon server URL.
   */

  function SalesCallBuilder(serverUrl) {
    _classCallCheck(this, SalesCallBuilder);

    _get(Object.getPrototypeOf(SalesCallBuilder.prototype), "constructor", this).call(this, serverUrl);
    this.url.segment("sales");
  }

  _inherits(SalesCallBuilder, _CallBuilder);

  _createClass(SalesCallBuilder, {
    sale: {

      /**
       * Provides information on a single sale.
       * @param {string} id Sale ID
       * @returns {SalesCallBuilder}
       */

      value: function sale(id) {
        this.filter.push(["sales", id.toString()]);
        return this;
      }
    },
    forBaseAsset: {

      /**
       * Filters sales by asset
       * @param {string} asset For example: `USD`
       * @returns {SalesCallBuilder}
       */

      value: function forBaseAsset(asset) {
        this.url.addQuery("base_asset", asset);
        return this;
      }
    },
    forOwner: {

      /**
       * Filters sales by owner
       * @param {string} owner For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
       * @returns {SalesCallBuilder}
       */

      value: function forOwner(owner) {
        this.url.addQuery("owner", owner);
        return this;
      }
    },
    openOnly: {

      /**
       * Filters sales by open state
       * @param {boolean} openOnly
       * @return {SalesCallBuilder}
       */

      value: (function (_openOnly) {
        var _openOnlyWrapper = function openOnly() {
          return _openOnly.apply(this, arguments);
        };

        _openOnlyWrapper.toString = function () {
          return _openOnly.toString();
        };

        return _openOnlyWrapper;
      })(function () {
        var openOnly = arguments[0] === undefined ? true : arguments[0];

        this.url.addQuery("open_only", openOnly);
        return this;
      })
    },
    upcoming: {

      /**
       * Filter sales which will start soon.
       * @param {boolean} upcoming
       * @return {SalesCallBuilder}
       */

      value: (function (_upcoming) {
        var _upcomingWrapper = function upcoming() {
          return _upcoming.apply(this, arguments);
        };

        _upcomingWrapper.toString = function () {
          return _upcoming.toString();
        };

        return _upcomingWrapper;
      })(function () {
        var upcoming = arguments[0] === undefined ? true : arguments[0];

        this.url.addQuery("upcoming", upcoming);
        return this;
      })
    },
    forName: {

      /**
       * Filters sales by name
       * @param {string} name For example: `awesome sale`
       * @returns {SalesCallBuilder}
       */

      value: function forName(name) {
        this.url.addQuery("name", name);
        return this;
      }
    },
    currentSoftCapsRatio: {

      /**
       * Filter sales in which the current сap exceeds 
       * the specified percentage `bound` of the soft cap.
       * @param {Number} bound - percent value from 0 to 100
       */

      value: function currentSoftCapsRatio() {
        var bound = arguments[0] === undefined ? 0 : arguments[0];

        if (bound < 0 || bound > 100) {
          throw new Error("bound value is out of range 0 <= x <= 100");
        }

        this.url.addQuery("current_soft_caps_ratio", bound);
        return this;
      }
    },
    withCollectedValueBound: {

      /**
       * Filter sales in which the current сap exceeds `collectedValueBound`.
       * @param {number} collectedValueBound - lower bound of the current cap.
       * @returns {SalesCallBuilder}
       */

      value: function withCollectedValueBound() {
        var collectedValueBound = arguments[0] === undefined ? 0 : arguments[0];

        this.url.addQuery("collected_value_bound", collectedValueBound);
        return this;
      }
    },
    sortByMostFounded: {

      /**
       * Sort types:
       * 1 - most founded;
       * 2 - end time.
       * 3 - popularity;
       * NOTE! If `sort_by` flag set, paging params 
       * will be ignored, and pagination will not work.
       */

      /**
      * Sort sales in order when sale with 
      * bigger current cap will be first.
      */

      value: function sortByMostFounded() {
        this.url.addQuery("sort_by", 1);
        return this;
      }
    },
    sortByEndType: {

      /**
       * Sort sales in order when sale with 
       * the closest end time will be first.
       */

      value: function sortByEndType() {
        this.url.addQuery("sort_by", 2);
        return this;
      }
    },
    sortByPopularity: {

      /**
       * Sort sales in the order when a sale with 
       * a large number of unique investors will be the first.
       */

      value: function sortByPopularity() {
        this.url.addQuery("sort_by", 3);
        return this;
      }
    },
    sortBy: {

      /**
       *  Sort sales with provided type
       */

      value: function sortBy(type) {
        this.url.addQuery("sort_by", type);
        return this;
      }
    }
  });

  return SalesCallBuilder;
})(CallBuilder);