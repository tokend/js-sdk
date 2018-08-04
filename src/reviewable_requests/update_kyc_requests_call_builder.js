import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class UpdateKYCRequestCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link UpdateKYCRequestCallBuilder} pointed to server defined by serverUrl
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#update_kyc}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/update_kyc');
    }

    /**
     * Filters KYC changing
     * @param {string} updated_account_id For example: `GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB`
     * @returns {UpdateKYCRequestCallBuilder}
     */
    forAccount(updated_account_id) {
        this.url.addQuery('account_to_update_kyc', updated_account_id);
        return this;
    }
}
