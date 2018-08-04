import {CallBuilder} from "./call_builder";

export class OrderBookCallBuilder extends CallBuilder {
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('order_book');
    }

    assetPair(baseAsset, quoteAsset, isBuy = false) {
        this.url.addQuery('base_asset', baseAsset);
        this.url.addQuery('quote_asset', quoteAsset);
        this.url.addQuery('is_buy', isBuy);
        return this;
    }

    forOrderBookID(orderBookID) {
        this.url.addQuery('order_book_id', orderBookID);
        return this;
    }

    forOwnerID(ownerID) {
        this.url.addQuery('owner_id', ownerID);
        return this;
    }
}
