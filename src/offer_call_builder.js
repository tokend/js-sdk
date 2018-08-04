import {CallBuilder} from "./call_builder";

export class OfferCallBuilder extends CallBuilder {
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('offers');
    }

    forAccount(accountId) {
        this.filter.push(['accounts', accountId, 'offers']);
        return this;
    }

    assetPair(baseAsset, quoteAsset) {
        this.url.addQuery('base_asset', baseAsset);
        this.url.addQuery('quote_asset', quoteAsset);
        return this;
    }

    isBuy(isBuy = false) {
        this.url.addQuery('is_buy', isBuy);
        return this;
    }

    orderBookID(orderBookID) {
        this.url.addQuery('order_book_id', orderBookID);
        return this;
    }

    onlyPrimary(onlyPrimary) {
        this.url.addQuery('only_primary', onlyPrimary);
        return this;
    }
}
