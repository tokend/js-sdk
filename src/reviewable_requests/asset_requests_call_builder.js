import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class AssetRequestsCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link AssetRequestCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#assets}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/assets');
    }

    /**
     * Filters asset creation 
     * @param {string} asset For example: `BTC`
     * @returns {AssetRequestsCallBuilder}
     */
    forAssetCode(asset) {
        this.url.addQuery('asset', asset);
        return this;
    }
}
