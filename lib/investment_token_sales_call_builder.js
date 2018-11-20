"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var InvestmentTokenSalesCallBuilder = exports.InvestmentTokenSalesCallBuilder = (function (_CallBuilder) {
  /**
   * Creates a new {@link InvestmentTokenSalesCallBuilder} pointed to server defined by serverUrl.
   *
   * Do not create this object directly, use {@link Server#callBuilder#investmentTokenSales}.
   * @constructor
   * @extends CallBuilder
   * @param {string} serverUrl Horizon server URL.
   */

  function InvestmentTokenSalesCallBuilder(serverUrl) {
    _classCallCheck(this, InvestmentTokenSalesCallBuilder);

    _get(Object.getPrototypeOf(InvestmentTokenSalesCallBuilder.prototype), "constructor", this).call(this, serverUrl);
    this.url.segment("investment_token_sales");
  }

  _inherits(InvestmentTokenSalesCallBuilder, _CallBuilder);

  _createClass(InvestmentTokenSalesCallBuilder, {
    forBaseAsset: {

      /**
      * Filters sales by asset
      * @param {string} asset For example: `USD`
      * @returns {InvestmentTokenSalesCallBuilder}
      */

      value: function forBaseAsset(asset) {
        this.url.addQuery("base_asset", asset);
        return this;
      }
    },
    sale: {

      /**
       * Provides information on a single sale.
       * @param {string} id Sale ID
       * @returns {InvestmentTokenSalesCallBuilder}
       */

      value: function sale(id) {
        this.filter.push(["investment_token_sales", id.toString()]);
        return this;
      }
    },
    forOwner: {

      /**
       * Filters sales by owner
       * @param {string} owner For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
       * @returns {InvestmentTokenSalesCallBuilder}
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
      * @return {InvestmentTokenSalesCallBuilder}
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
    forName: {

      /**
      * Filters sales by name
      * @param {string} name For example: `awesome sale`
      * @returns {InvestmentTokenSalesCallBuilder}
      */

      value: function forName(name) {
        this.url.addQuery("name", name);
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
    sortByEndTime: {

      /**
       * Sort sales in order when sale with
       * the closest end time will be first.
       */

      value: function sortByEndTime() {
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
    sortByStartTime: {

      /**
       * Sort sales in the order when a sale with latest date
       * of creation will be the first.
       */

      value: function sortByStartTime() {
        this.url.addQuery("sort_by", 4);
        return this;
      }
    },
    sortByTradingStartDate: {

      /**
       * Sort sales in the order when a sale with latest date
       * of trading start will be the first.
       */

      value: function sortByTradingStartDate() {
        this.url.addQuery("sort_by", 5);
        return this;
      }
    },
    sortBySettlementsStartDate: {

      /**
       * Sort sales in the order when a sale with latest date
       * of settlements start will be the first.
       */

      value: function sortBySettlementsStartDate() {
        this.url.addQuery("sort_by", 6);
        return this;
      }
    },
    sortBySettlementsEndDate: {

      /**
       * Sort sales in the order when a sale with latest date
       * of settlements end will be the first.
       */

      value: function sortBySettlementsEndDate() {
        this.url.addQuery("sort_by", 7);
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

  return InvestmentTokenSalesCallBuilder;
})(CallBuilder);