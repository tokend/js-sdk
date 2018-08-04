import {CallBuilder} from "./call_builder";

export class BalanceCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link BalanceCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#balances}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('balances');
    }

    forAccount(accountId) {
        this.url.addQuery('account', accountId);
        return this;
    }

    balanceId(balanceId) {
        this.filter.push(['balances', balanceId, 'asset']);
        return this;
    }

    forAsset(asset) {
        this.url.addQuery('asset', asset);
        return this;
    }

    account(balanceId) {
        this.filter.push(['balances', balanceId, 'account']);
        return this;
    }

    /**
     * This endpoint represents balances filtered by asset code
     * @param {string} like USD
     * @returns {AssetCallBuilder}
     */
    assetHolders(assetCode) {
        this.filter.push(['assets', assetCode, 'holders']);
        return this;
    }
}
