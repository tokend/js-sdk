import {CallBuilder} from "./call_builder";

export class DefaultLimitsCallBuilder extends CallBuilder {
    
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('default_limits');
    }
    
     /**
     * This endpoint represents limits for particular accountType.
     * @param {int} like enum AccountType
     * @returns {DefaultLimitsCallBuilder}
     */
    limits(accountType) {
        this.filter.push(['default_limits', accountType.toString()]);
        return this;
    }
}
