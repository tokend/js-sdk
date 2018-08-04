"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errors = require("./errors");

var NotFoundError = _errors.NotFoundError;
var NetworkError = _errors.NetworkError;
var BadRequestError = _errors.BadRequestError;

var forEach = _interopRequire(require("lodash/forEach"));

var _tokendJsBase = require("tokend-js-base");

var xdr = _tokendJsBase.xdr;
var Account = _tokendJsBase.Account;
var hash = _tokendJsBase.hash;

var Config = require("./config").Config;

var constants = _interopRequire(require("./const"));

var TimeSyncer = require("./time-syncer").TimeSyncer;

var URI = require("urijs");
var URITemplate = require("urijs").URITemplate;

var axios = require("axios");
var EventSource = require("./EventSource.js");
var toBluebird = require("bluebird").resolve;

/**
 * Creates a new {@link CallBuilder} pointed to server defined by serverUrl.
 *
 * This is an **abstract** class. Do not create this object directly, use {@link Server} class.
 * @param {string} serverUrl
 * @class CallBuilder
 */

var CallBuilder = exports.CallBuilder = (function () {
  function CallBuilder(serverUrl) {
    _classCallCheck(this, CallBuilder);

    this.url = serverUrl;
    this.filter = [];
  }

  _createClass(CallBuilder, {
    checkFilter: {

      /**
       * @private
       */

      value: function checkFilter() {
        if (this.filter.length >= 2) {
          throw new BadRequestError("Too many filters specified", this.filter);
        }
        if (this.filter.length === 1) {
          this.url.segment(this.filter[0]);
        }
      }
    },
    checkPrefix: {

      /**
       * @private
       */

      value: function checkPrefix() {
        if (Config.isURLPrefix === true) {
          this.url.segment(Config.getURLPrefix().concat(this.filter[0]));
        }
      }
    },
    call: {

      /**
       * Triggers a HTTP request using this builder's current configuration.
       * Returns a Promise that resolves to the server's response.
       * @returns {Promise}
       */

      value: function call() {
        var _this = this;

        this.checkFilter();
        return this._sendNormalRequest(this.url).then(function (r) {
          return _this._parseResponse(r);
        });
      }
    },
    callWithSignature: {
      /**
       * Should be used when forming GET requests subjected to Signature
       */

      value: function callWithSignature(keypair) {
        var _this = this;

        this.checkFilter();
        var config = this._getRequestConfig(this.url, keypair);
        return this._sendNormalRequest(this.url, config).then(function (r) {
          return _this._parseResponse(r);
        });
      }
    },
    stream: {
      /**
       * Creates an EventSource that listens for incoming messages from the server. To stop listening for new
       * events call the function returned by this method.
       * @see [Horizon Response Format](https://www.stellar.org/developers/horizon/learn/responses.html)
       * @see [MDN EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
       * @param {object} [options] EventSource options.
       * @param {function} [options.onmessage] Callback function to handle incoming messages.
       * @param {function} [options.onerror] Callback function to handle errors.
       * @returns {function} Close function. Run to close the connection and stop listening for new events.
       */

      value: function stream(options, keypair) {
        var _this = this;

        this.checkFilter();

        // EventSource object
        var es = undefined;
        // timeout is the id of the timeout to be triggered if there were no new messages
        // in the last 15 seconds. The timeout is reset when a new message arrive.
        // It prevents closing EventSource object in case of 504 errors as `readyState`
        // property is not reliable.
        var timeout = undefined;

        var createTimeout = function () {
          timeout = setTimeout(function () {
            es.close();
            es = createEventSource();
          }, 45 * 1000);
        };

        var createEventSource = function () {
          try {
            var config = _this._getRequestConfig(URI(_this.url), keypair);
            _this.checkPrefix();
            es = new EventSource(_this.url.toString(), config);
          } catch (err) {
            if (options.onerror) {
              options.onerror(err);
              options.onerror("EventSource not supported");
            }
            return false;
          }

          createTimeout();

          es.onmessage = function (message) {
            var result = message.data ? _this._parseRecord(JSON.parse(message.data)) : message;
            if (result.paging_token) {
              _this.url.setQuery("cursor", result.paging_token);
            }
            clearTimeout(timeout);
            createTimeout();
            options.onmessage(result);
          };

          es.onerror = function (error) {
            if (options.onerror) {
              options.onerror(error);
            }
          };

          return es;
        };

        createEventSource();
        return function close() {
          clearTimeout(timeout);
          es.close();
        };
      }
    },
    _getRequestConfig: {
      /**
       * @private
       */

      value: function _getRequestConfig(url, keypair) {
        if (!keypair) {
          throw new Error("Need keypair");
        }
        var validUntil = Math.floor(new TimeSyncer().now() + constants.SIGNATURE_VALID_SEC).toString();
        var signatureBase = "{ uri: '" + url.resource() + "', valid_untill: '" + validUntil.toString() + "'}";
        var data = hash(signatureBase);
        var signature = keypair.signDecorated(data);
        return {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-AuthValidUnTillTimestamp": validUntil.toString(),
            "X-AuthPublicKey": keypair.accountId(),
            "X-AuthSignature": signature.toXDR("base64")
          },
          timeout: constants.SUBMIT_TRANSACTION_TIMEOUT
        };
      }
    },
    _requestFnForLink: {
      /**
       * @private
       */

      value: function _requestFnForLink(link) {
        var _this = this;

        return function (opts) {
          var uri = undefined;

          if (link.template) {
            var template = URITemplate(link.href);
            uri = URI(template.expand(opts));
          } else {
            uri = URI(link.href);
          }

          return _this._sendNormalRequest(uri).then(function (r) {
            return _this._parseRecord(r);
          });
        };
      }
    },
    _parseRecord: {

      /**
       * Convert each link into a function on the response object.
       * @private
       */

      value: function _parseRecord(json) {
        var _this = this;

        if (!json._links) {
          return json;
        }
        forEach(json._links, function (n, key) {
          json[key] = _this._requestFnForLink(n);
        });
        return json;
      }
    },
    _sendNormalRequest: {
      value: function _sendNormalRequest(url, config) {
        if (url.authority() === "") {
          url = url.authority(this.url.authority());
        }

        if (url.protocol() === "") {
          url = url.protocol(this.url.protocol());
        }

        if (Config.isURLPrefix() === true) {
          url.segment(Config.getURLPrefixedPath(url.path()));
        }

        // Temp fix for: https://github.com/stellar/js-stellar-sdk/issues/15
        var promise = axios.get(url.toString(), config).then(function (response) {
          return response.data;
        })["catch"](this._handleNetworkError);
        return toBluebird(promise);
      }
    },
    _parseResponse: {

      /**
       * @private
       */

      value: function _parseResponse(json) {
        if (json._embedded && json._embedded.records) {
          return this._toCollectionPage(json);
        } else {
          return this._parseRecord(json);
        }
      }
    },
    _toCollectionPage: {

      /**
       * @private
       */

      value: function _toCollectionPage(json) {
        var _this = this;

        for (var i = 0; i < json._embedded.records.length; i++) {
          json._embedded.records[i] = this._parseRecord(json._embedded.records[i]);
        }
        return {
          records: json._embedded.records,
          next: function (keypair) {
            var url = URI(json._links.next.href).protocol("https");
            if (keypair) {
              var config = _this._getRequestConfig(url, keypair);
              return _this._sendNormalRequest(url, config).then(function (r) {
                return _this._toCollectionPage(r);
              });
            } else {
              return _this._sendNormalRequest(url).then(function (r) {
                return _this._toCollectionPage(r);
              });
            }
          },
          prev: function (keypair) {
            if (keypair) {
              var _url = URI(json._links.prev.href).protocol("https");
              var config = _this._getRequestConfig(_url, keypair);
              return _this._sendNormalRequest(_url, config).then(function (r) {
                return _this._toCollectionPage(r);
              });
            } else {
              return _this._sendNormalRequest(url).then(function (r) {
                return _this._toCollectionPage(r);
              });
            }
          }
        };
      }
    },
    _handleNetworkError: {

      /**
       * @private
       */

      value: function _handleNetworkError(response) {
        if (response instanceof Error) {
          return Promise.reject(response);
        } else {
          switch (response.status) {
            case 404:
              return Promise.reject(new NotFoundError(response.data, response));
            default:
              return Promise.reject(new NetworkError(response.status, response));
          }
        }
      }
    },
    cursor: {

      /**
       * Adds `cursor` parameter to the current call. Returns the CallBuilder object on which this method has been called.
       * @see [Paging](https://www.stellar.org/developers/horizon/learn/paging.html)
       * @param {string} cursor A cursor is a value that points to a specific location in a collection of resources.
       */

      value: (function (_cursor) {
        var _cursorWrapper = function cursor(_x) {
          return _cursor.apply(this, arguments);
        };

        _cursorWrapper.toString = function () {
          return _cursor.toString();
        };

        return _cursorWrapper;
      })(function (cursor) {
        this.url.addQuery("cursor", cursor);
        return this;
      })
    },
    limit: {

      /**
       * Adds `limit` parameter to the current call. Returns the CallBuilder object on which this method has been called.
       * @see [Paging](https://www.stellar.org/developers/horizon/learn/paging.html)
       * @param {number} number Number of records the server should return.
       */

      value: function limit(number) {
        this.url.addQuery("limit", number);
        return this;
      }
    },
    order: {

      /**
       * Adds `order` parameter to the current call. Returns the CallBuilder object on which this method has been called.
       * @param {"asc"|"desc"} direction
       */

      value: function order(direction) {
        this.url.addQuery("order", direction);
        return this;
      }
    }
  });

  return CallBuilder;
})();