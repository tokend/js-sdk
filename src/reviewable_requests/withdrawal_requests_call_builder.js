import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class WithdrawalRequestsCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link WithdrawalRequestsCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#withdrwals}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/withdrawals');
    }

    /**
     * Filters withdrawals by destination asset.
     * @param {string} asset For example: `BTC`
     * @returns {WithdrawalRequestsCallBuilder}
     */
    forDestAsset(asset) {
        this.url.addQuery('dest_asset_code', asset);
        return this;
    }
}
