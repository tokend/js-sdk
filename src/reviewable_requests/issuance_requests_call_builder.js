import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class IssuanceRequestsCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link IssuanceRequestCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#issuances}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/issuances');
    }

    /**
     * Filters asset creation 
     * @param {string} asset For example: `BTC`
     * @returns {IssuanceRequestsCallBuilder}
     */
    forAssetCode(asset) {
        this.url.addQuery('asset', asset);
        return this;
    }
}
