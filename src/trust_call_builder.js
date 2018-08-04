import {CallBuilder} from "./call_builder";

export class TrustCallBuilder extends CallBuilder {
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('trusts');
    }

    balanceId(id) {
      this.filter.push(['trusts', id]);
      return this;
    }

}
