import {CallBuilder} from "./call_builder";

export class HistoryOffersCallBuilder extends CallBuilder {
  constructor(serverUrl) {
    super(serverUrl);
    this.url.segment('history_offers');
  }

  forBaseAsset(asset) {
    this.url.addQuery('base_asset', asset);
    return this;
  }

  forQuoteAsset(asset) {
    this.url.addQuery('quote_asset', asset);
    return this;
  }

  forOwnerId (id) {
    this.url.addQuery('owner_id', id);
    return this;
  }
}
