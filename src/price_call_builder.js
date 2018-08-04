import {CallBuilder} from "./call_builder";

export class PriceCallBuilder extends CallBuilder {
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('prices/history');
    }

    history(baseAsset, quoteAsset, since) {
        this.url.addQuery('base_asset', baseAsset);
        this.url.addQuery('quote_asset', quoteAsset);
        this.url.addQuery('since', since);
        return this;
    }
}
