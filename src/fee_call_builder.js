import {CallBuilder} from "./call_builder";

export class FeeCallBuilder extends CallBuilder {
    
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('fees');
    }
    
     /**
     * This endpoint represents fee for particular feeType and asset.
     * @param {int} like enum FeeType
     * @param {string} like XBU
     * @returns {FeeCallBuilder}
     */
    fee(feeType, asset, accountId, amount, subtype=0) {
        this.filter.push(['fees', feeType.toString()]);
        this.url.addQuery('asset', asset);
        this.url.addQuery('account', accountId);
        this.url.addQuery('amount', amount);
        this.url.addQuery('subtype', subtype);
        return this;
    }

    forfeitRequest(accountID, amount, asset) {
        this.filter.push(['accounts', accountID, 'forfeit_request']);
        this.url.addQuery('amount', amount);
        this.url.addQuery('asset', asset);
        return this;
    }
}
