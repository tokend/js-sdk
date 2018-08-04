import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class UpdateSaleDetailsRequestCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link UpdateSaleDetailsRequestCallBuilder} pointed to server defined by serverUrl
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#update_sale_details}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('/request/update_sale_details');
    }
}