import {CallBuilder} from "./call_builder";

export class ContactsCallBuilder extends CallBuilder {
    
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('users');
    }

    accountId(id, filter) {
        this.filter.push(['users', id, 'contacts']);
        if (filter) {
          this.url.addQuery('filter', filter);
        }
        return this;
    }
}
