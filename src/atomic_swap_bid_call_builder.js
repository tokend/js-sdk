import {CallBuilder} from "./call_builder";

export class AtomicSwapBidCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link AtomicSwapBidCallBuilder}
     * pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#atomic_swap_bid}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('atomic_swap_bids');
    }

    /**
     * Provides information on a single atomic swap bid.
     * @param {string} id Contract ID
     * @returns {AtomicSwapBidCallBuilder}
     */

    bid(id) {
        this.filter.push(['atomic_swap_bids', id.toString()]);
        return this;
    }

    /**
     * This endpoint represents atomic swap bids filters them by owner id
     * @param {string} accountID like `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
     * @returns {AtomicSwapBidCallBuilder}
     */
    forOwner(accountID) {
        this.url.addQuery('owner_id', accountID);
        return this;
    }

    /**
     * This endpoint represents atomic swap bids filters them by base asset
     * @param {string} assetCode like `DL_TICKETS`
     * @returns {AtomicSwapBidCallBuilder}
     */
    forBaseAsset(assetCode) {
        this.url.addQuery('base_asset', assetCode);
        return this;
    }
}
