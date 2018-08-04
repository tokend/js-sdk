import {CallBuilder} from "./call_builder";

export class AssetPairCallBuilder extends CallBuilder {
  constructor(serverUrl) {
    super(serverUrl);
    this.url.segment('asset_pairs');
  }

  convert (amount, sourceAsset, destAsset) {
    this.filter.push(['asset_pairs', 'convert']);
    this.url.addQuery('amount', amount);
    this.url.addQuery('source_asset', sourceAsset);
    this.url.addQuery('dest_asset', destAsset);
    return this;
  }
}
