import {CallBuilder} from "./call_builder";

export class TradeCallBuilder extends CallBuilder {
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('trades');
    }

    assetPair(baseAsset, quoteAsset) {
        this.url.addQuery('base_asset', baseAsset);
        this.url.addQuery('quote_asset', quoteAsset);
        return this;
    }

    orderBookID(orderBookID) {
        this.url.addQuery('order_book_id', orderBookID);
        return this;
    }
}
