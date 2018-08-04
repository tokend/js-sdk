import {CallBuilder} from "./call_builder";

export class SaleAntesCallBuilder extends CallBuilder {
  constructor(serverUrl) {
    super(serverUrl);
    this.url.segment('sale_antes');
  }

  balanceId (balanceId) {
    this.url.addQuery('participant_balance_id', balanceId);
    return this;
  }

  saleId (saleId) {
    this.url.addQuery('sale_id', saleId);
    return this;
  }
}
