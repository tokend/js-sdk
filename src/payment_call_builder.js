import {CallBuilder} from "./call_builder";

export class PaymentCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link PaymentCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#payments}.
     * @see [All Payments](https://www.stellar.org/developers/horizon/reference/payments-all.html)
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('payments');
    }

    /**
     * This endpoint responds with a collection of Payment operations where the given account was either the sender or receiver.
     * @see [Payments for Account](https://www.stellar.org/developers/horizon/reference/payments-for-account.html)
     * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {PaymentCallBuilder}
     */
    forAccount(accountId) {
        this.filter.push(['accounts', accountId, 'payments']);
        return this;
    }

    /**
     * This endpoint represents all payment operations that are part of a valid transactions in a given ledger.
     * @see [Payments for Ledger](https://www.stellar.org/developers/horizon/reference/payments-for-ledger.html)
     * @param {number} ledgerId Ledger ID
     * @returns {PaymentCallBuilder}
     */
    forLedger(ledgerId) {
        this.filter.push(['ledgers', ledgerId, 'payments']);
        return this;
    }

    /**
     * This endpoint represents all payment operations that are part of a given transaction.
     * @see [Payments for Transaction](https://www.stellar.org/developers/horizon/reference/payments-for-transaction.html)
     * @param {string} transactionId Transaction ID
     * @returns {PaymentCallBuilder}
     */
    forTransaction(transactionId) {
        this.filter.push(['transactions', transactionId, 'payments']);
        return this;
    }

    forExchange(exchangeId) {
        this.url.addQuery('exchange_id', exchangeId);
        return this;
    }

    forAsset(asset) {
        this.url.addQuery('asset', asset);
        return this;
    }

    forReference(reference) {
        this.url.addQuery('reference', reference);
        return this;
    }

    сompletedOnly() {
        this.url.addQuery('completed_only', true);
        return this;
    }

    sinceDate(date) {
        this.url.addQuery('since', date);
        return this;
    }

    toDate(date) {
        this.url.addQuery('to', date);
        return this;
    }
}
