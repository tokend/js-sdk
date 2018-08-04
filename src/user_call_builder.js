import {CallBuilder} from "./call_builder";

export class UserCallBuilder extends CallBuilder {
    
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('users');
    }
    
    approved() {
        this.url.addQuery('status', 'approved');
        return this;
    }

    regRequests() {
        this.url.addQuery('status', 'reg_requests');
        return this;
    }

    limitIncreaseRequests() {
        this.url.addQuery('status', 'limit_requests');
        return this;
    }

    accountId(id) {
        this.filter.push(['users', id]);
        return this;
    }

    disabled() {
        this.url.addQuery('status', 'blocked');
        return this;
    }

    status(status) {
        this.url.addQuery('status', status);
        return this;
    }
}
