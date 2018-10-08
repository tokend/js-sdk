import {CallBuilder} from "./call_builder";

export class ContractCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link ContractCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#contracts}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('contracts');
    }

    /**
     * Provides information on a single contract.
     * @param {string} id Contract ID
     * @returns {ContractCallBuilder}
     */

    contract(id) {
        this.filter.push(['contracts', id.toString()]);
        return this;
    }

    /**
     * This endpoint represents contracts filters requests where start time
     * equal or more than passed value
     * @param {string} startTime like `1234567892`
     * @returns {ContractCallBuilder}
     */
    forStartTime(startTime) {
        this.url.addQuery('start_time', startTime);
        return this;
    }

    /**
     * This endpoint represents contracts filters requests where end time
     * equal or more than passed value
     * @param {string} endTime like `1234567892`
     * @returns {ContractCallBuilder}
     */
    forEndTime(endTime) {
        this.url.addQuery('end_time', endTime);
        return this;
    }

    /**
     * This endpoint represents contracts filtered by disputing state
     * @param {string} isDisputing like true
     * @returns {ContractCallBuilder}
     */
    byDisputingState(isDisputing) {
        this.url.addQuery('disputing', isDisputing);
        return this;
    }

    /**
     * This endpoint represents contracts filtered by completed state
     * @param {string} isCompleted like true
     * @returns {ContractCallBuilder}
     */
    byCompletedState(isCompleted) {
        this.url.addQuery('completed', isCompleted);
        return this;
    }

    /**
     * Filters contracts by counterparty
     * @param {string} counterpartyID For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
     * @returns {ContractCallBuilder}
     */
    forCounterparty(counterpartyID) {
        this.url.addQuery('counterparty', counterpartyID);
        return this;
    }

    /**
     * Filters contracts by source
     * @param {string} sourceID For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
     * @returns {ContractRequestsCallBuilder}
     */
    forSource(sourceID) {
        this.url.addQuery('source', sourceID);
        return this;
    }

    /**
     * Filters contracts by contract number
     * @param {string} contractNumber For example: `123456`
     * @returns {ContractCallBuilder}
     */
    forContractNumber(contractNumber) {
        this.url.addQuery('contract_number', contractNumber);
        return this;
    }

    /**
     * This endpoint represents contracts filtered by escrow ID
     * @param {string} escrowID like `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {ContractCallBuilder}
     */
    byEscrowID(escrowID) {
        this.url.addQuery('escrow_id', escrowID);
        return this;
    }
}
