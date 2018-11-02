import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class InvestmentTokenSaleRequestsCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link InvestmentTokenSalesCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#sales}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/investment_token_sales');
    }

    /**
     * Filters sales by base asset.
     * @param {string} asset For example: `BTC`
     * @returns {InvestmentTokenSalesCallBuilder}
     */
    forBaseAsset(asset) {
        this.url.addQuery('base_asset', asset);
        return this;
    }
}
