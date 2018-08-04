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
}
