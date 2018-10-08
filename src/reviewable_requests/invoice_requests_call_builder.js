import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class InvoiceRequestsCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link InvoiceRequestsCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#invoices}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/invoices');
    }

    /**
     * Filters contract invoices
     * @param {string} contractID For example: `12`
     * @returns {InvoiceRequestsCallBuilder}
     */
    forContractID(contractID) {
        this.url.addQuery('contract_id', contractID);
        return this;
    }
}
