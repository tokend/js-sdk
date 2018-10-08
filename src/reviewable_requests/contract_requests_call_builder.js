import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class ContractRequestsCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link ContractRequestsCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#contracts}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/contracts');
    }

    /**
     * Filters contract requests by contract number
     * @param {string} contractNumber For example: `123456`
     * @returns {ContractRequestsCallBuilder}
     */
    forContractNumber(contractNumber) {
        this.url.addQuery('contract_number', contractNumber);
        return this;
    }

    /**
     * This endpoint represents contract requests filters requests where start time
     * equal or more than passed value
     * @param {string} startTime like `1234567892`
     * @returns {ContractRequestsCallBuilder}
     */
    forStartTime(startTime) {
        this.url.addQuery('start_time', startTime);
        return this;
    }

    /**
     * This endpoint represents contract requests filters requests where end time
     * equal or more than passed value
     * @param {string} endTime like `1234567892`
     * @returns {ContractRequestsCallBuilder}
     */
    forEndTime(endTime) {
        this.url.addQuery('end_time', endTime);
        return this;
    }
}
