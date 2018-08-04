import {CallBuilder} from "./call_builder";

export class DocumentCallBuilder extends CallBuilder {
    
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('users');
    }

    all(accountId) {
         this.filter.push(['users', accountId, 'documents']);
        return this;
    }

    file(accountId, fileType) {
        this.filter.push(['users', accountId, 'documents', fileType]);
        return this;
    }
}