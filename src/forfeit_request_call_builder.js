import {CallBuilder} from "./call_builder";

export class ForfeitRequestCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link ForfeitRequestRequestCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#forfeitRequests}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('forfeit_requests');
    }

    /**
     * The ForfeitRequest details endpoint provides information on a single ForfeitRequest. The request ID provided in the id
     * argument specifies which request to load.
     * @see [Operation Details](https://www.stellar.org/developers/horizon/reference/operations-single.html)
     * @param {number} operationId Operation ID
     * @returns {OperationCallBuilder}
     */
    forfeitRequest(requestId) {
        this.filter.push(['payment_requests', requestId]);
        return this;
    }

    /**
     * This endpoint represents all forfeit requests that were included in valid transactions that affected a particular account.
     * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {OperationCallBuilder}
     */
    forAccount(accountId) {
        this.url.addQuery('target_account', accountId);
        return this;
    }

    // forExchange or forAccount should be set
    forBalance(balanceId) {
        this.url.addQuery('target_balance', balanceId);
        return this;
    }

    forExchange(exchangeId) {
        this.url.addQuery('exchange', exchangeId);
        return this;
    }

    /**
     * This endpoint represents all ForfeitRequest that were included in valid transactions with state.
     * @param {int} state 1:PENDING, 2:ACCEPTED, 3:REJECTED
     * @returns {OperationCallBuilder}
     */
    forState(state) {
        this.url.addQuery('state', state);
        return this;
    }
}
