import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class PreissuanceRequestsCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link PreissuanceRequestsCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#preissuance}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/preissuances');
    }

    /**
     * Filters asset creation 
     * @param {string} asset For example: `BTC`
     * @returns {PreissuanceRequestsCallBuilder}
     */
    forAssetCode(asset) {
        this.url.addQuery('asset', asset);
        return this;
    }
}
