import {CallBuilder} from "./call_builder";

export class AssetCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link PaymentCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#payments}.
     * @see [All Payments](https://www.stellar.org/developers/horizon/reference/payments-all.html)
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('assets');
    }

    /**
     * This endpoint represents assets filtered by asset owner
     * @param {string} like GBF2LJ5VCZETXG6DJ3QT5KUT4FY5UCZHX4YAHOQIFBNF66QC7H26XRMQ
     * @returns {AssetCallBuilder}
     */
    forOwner(assetOwnerAccountId) {
        this.url.addQuery('owner', assetOwnerAccountId);
        return this;
    }

    /**
     * This endpoint represents asset filtered by asset code
     * @param {string} like USD
     * @returns {AssetCallBuilder}
     */
    byCode(assetCode) {
        this.filter.push(['assets', assetCode]);
        return this;
    }


}
