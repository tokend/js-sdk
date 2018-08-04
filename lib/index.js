"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
require("es6-promise").polyfill();

// stellar-sdk classes to expose

_defaults(exports, _interopRequireWildcard(require("./errors")));

exports.Config = require("./config").Config;
exports.Server = require("./server").Server;

// expose classes and functions from 'tokend-js-base'

_defaults(exports, _interopRequireWildcard(require("tokend-js-base")));

exports["default"] = module.exports;