import {CallBuilder} from "./call_builder";

export class TransactionCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link TransactionCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#transactions}.
     * @see [All Transactions](https://www.stellar.org/developers/horizon/reference/transactions-all.html)
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('transactions');
    }

    /**
     * The transaction details endpoint provides information on a single transaction. The transaction hash provided in the hash argument specifies which transaction to load.
     * @see [Transaction Details](https://www.stellar.org/developers/horizon/reference/transactions-single.html)
     * @param {string} transactionId Transaction ID
     * @returns {TransactionCallBuilder}
     */
    transaction(transactionId) {
        this.filter.push(['transactions', transactionId]);
        return this;
    }

    /**
     * This endpoint represents all transactions that affected a given account.
     * @see [Transactions for Account](https://www.stellar.org/developers/horizon/reference/transactions-for-account.html)
     * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {TransactionCallBuilder}
     */
    forAccount(accountId) {
        if (accountId !== undefined && typeof accountId.accountId === 'function') {
            accountId = accountId.accountId();
        }
        this.filter.push(['accounts', accountId, 'transactions']);
        return this;
    }

    /**
     * @param {object} Options for pending transactions filter
     */
    pending({ state, signedBy, notSignedBy }) {
        // TODO validate signedBy and notSignedBy not set simultaneously
        if (state !== undefined) {
            // 1 - pending
            // 3 - reject
            this.url.addQuery('state', state);
        }

        if (signedBy !== undefined) {
            if (typeof signedBy.accountId === 'function') {
                signedBy = signedBy.accountId();
            }
            this.url.addQuery('signed_by', signedBy);
        }
        
        if (notSignedBy !== undefined) {
            if (typeof notSignedBy.accountId === 'function') {
                notSignedBy = notSignedBy.accountId();
            }
            this.url.addQuery('not_signed_by', notSignedBy);
        }

        this.url.addQuery('pending', true);
        return this;
    }

    /**
     * This endpoint represents all transactions in a given ledger.
     * @see [Transactions for Ledger](https://www.stellar.org/developers/horizon/reference/transactions-for-ledger.html)
     * @param {number} ledgerId Ledger ID
     * @returns {TransactionCallBuilder}
     */
    forLedger(ledgerId) {
        this.filter.push(['ledgers', ledgerId, 'transactions']);
        return this;
    }
}
