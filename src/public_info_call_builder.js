import {CallBuilder} from "./call_builder";

export class PublicInfoCallBuilder extends CallBuilder {
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('public');
    }

    operations() {
        this.filter.push(['public', 'operations']);
        return this;
    }

    operation(operationId) {
        this.filter.push(['public', 'operations', operationId]);
        return this;
    }

    payments() {
        this.filter.push(['public', 'payments']);
        return this;
    }

    forAsset(asset) {
        this.url.addQuery('asset', asset);
        return this;
    }

    ledgers() {
        this.filter.push(['public', 'ledgers']);
        return this;
    }
}
