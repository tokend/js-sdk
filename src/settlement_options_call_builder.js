import {CallBuilder} from "./call_builder";

export class SettlementOptionsCallBuilder extends CallBuilder {
  constructor(serverUrl) {
    super(serverUrl);
    this.url.segment('settlement_options');
  }

  investor (accountId) {
    this.url.addQuery('investor', accountId);
    return this;
  }

  saleId (saleId) {
    this.url.addQuery('sale_id', saleId);
    return this;
  }
}
