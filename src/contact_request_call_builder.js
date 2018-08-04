import {CallBuilder} from "./call_builder";

export class ContactRequestCallBuilder extends CallBuilder {

    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('users');
    }

    accountId(id) {
        this.filter.push(['users', id, 'contacts', 'requests']);
        return this;
    }

    forKind(kind) {
       this.url.addQuery('kind', kind);
       return this;
    }

    forState(state) {
      this.url.addQuery('state', state);
      return this;
    }
}
