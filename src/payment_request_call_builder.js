import {CallBuilder} from "./call_builder";

export class PaymentRequestCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link PaymentRequestRequestCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#paymentRequests}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('payment_requests');
    }

    paymentsOnly() {
        this.url.addQuery('request_type', 2);
        return this;
    }

    paymentRequest(requestId) {
        this.filter.push(['payment_requests', requestId]);
        return this;
    }

    forAccount(accountId) {
        this.url.addQuery('target_account', accountId);
        return this;
    }

    // forExchange or forAccount should be set
    forBalance(balanceId) {
        this.url.addQuery('target_balance', balanceId);
        return this;
    }

    forExchange(accountId) {
        this.url.addQuery('exchange', accountId);
        return this;
    }

    /**
     * This endpoint represents all PaymentRequest that were included in valid transactions with state.
     * @param {int} state 1:PENDING, 2:ACCEPTED, 3:REJECTED
     * @returns {PaymentRequestCallBuilder}
     */
    forState(state) {
        this.url.addQuery('state', state);
        return this;
    }
}
