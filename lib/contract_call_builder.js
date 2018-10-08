"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var ContractCallBuilder = exports.ContractCallBuilder = (function (_CallBuilder) {
    /**
     * Creates a new {@link ContractCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#contracts}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */

    function ContractCallBuilder(serverUrl) {
        _classCallCheck(this, ContractCallBuilder);

        _get(Object.getPrototypeOf(ContractCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("contracts");
    }

    _inherits(ContractCallBuilder, _CallBuilder);

    _createClass(ContractCallBuilder, {
        contract: {

            /**
             * Provides information on a single contract.
             * @param {string} id Contract ID
             * @returns {ContractCallBuilder}
             */

            value: function contract(id) {
                this.filter.push(["contracts", id.toString()]);
                return this;
            }
        },
        forStartTime: {

            /**
             * This endpoint represents contracts filters requests where start time
             * equal or more than passed value
             * @param {string} startTime like `1234567892`
             * @returns {ContractCallBuilder}
             */

            value: function forStartTime(startTime) {
                this.url.addQuery("start_time", startTime);
                return this;
            }
        },
        forEndTime: {

            /**
             * This endpoint represents contracts filters requests where end time
             * equal or more than passed value
             * @param {string} endTime like `1234567892`
             * @returns {ContractCallBuilder}
             */

            value: function forEndTime(endTime) {
                this.url.addQuery("end_time", endTime);
                return this;
            }
        },
        byDisputingState: {

            /**
             * This endpoint represents contracts filtered by disputing state
             * @param {string} isDisputing like true
             * @returns {ContractCallBuilder}
             */

            value: function byDisputingState(isDisputing) {
                this.url.addQuery("disputing", isDisputing);
                return this;
            }
        },
        byCompletedState: {

            /**
             * This endpoint represents contracts filtered by completed state
             * @param {string} isCompleted like true
             * @returns {ContractCallBuilder}
             */

            value: function byCompletedState(isCompleted) {
                this.url.addQuery("completed", isCompleted);
                return this;
            }
        },
        forCounterparty: {

            /**
             * Filters contracts by counterparty
             * @param {string} counterpartyID For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
             * @returns {ContractCallBuilder}
             */

            value: function forCounterparty(counterpartyID) {
                this.url.addQuery("counterparty", counterpartyID);
                return this;
            }
        },
        forSource: {

            /**
             * Filters contracts by source
             * @param {string} sourceID For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
             * @returns {ContractRequestsCallBuilder}
             */

            value: function forSource(sourceID) {
                this.url.addQuery("source", sourceID);
                return this;
            }
        },
        forContractNumber: {

            /**
             * Filters contracts by contract number
             * @param {string} contractNumber For example: `123456`
             * @returns {ContractCallBuilder}
             */

            value: function forContractNumber(contractNumber) {
                this.url.addQuery("contract_number", contractNumber);
                return this;
            }
        },
        byEscrowID: {

            /**
             * This endpoint represents contracts filtered by escrow ID
             * @param {string} escrowID like `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
             * @returns {ContractCallBuilder}
             */

            value: function byEscrowID(escrowID) {
                this.url.addQuery("escrow_id", escrowID);
                return this;
            }
        }
    });

    return ContractCallBuilder;
})(CallBuilder);