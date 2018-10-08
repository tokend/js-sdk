import {CallBuilder} from "./call_builder";

export class AccountCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link AccountCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#accounts}.
     * @see [All Accounts](https://www.stellar.org/developers/horizon/reference/accounts-all.html)
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('accounts');
    }

    /**
     * Returns information and links relating to a single account.
     * The balances section in the returned JSON will also list all the trust lines this account has set up.
     *
     * @see [Account Details](https://www.stellar.org/developers/horizon/reference/accounts-single.html)
     * @param {string} id For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {AccountCallBuilder}
     */
    accountId(id) {
      this.filter.push(['accounts', id]);
      return this;
    }

    fees(accountId) {
      this.filter.push(['accounts', accountId, 'fees']);
      return this;
    }

    balances (accountId) {
      this.filter.push(['accounts', accountId, 'balances']);
      return this;
    }

    details (accountId) {
      this.filter.push(['accounts', accountId, 'balances', 'details']);
      return this;
    }

    referrals(accountId) {
      this.filter.push(['accounts', accountId, 'referrals']);
      return this;
    }

    signers(accountId) {
      this.filter.push(['accounts', accountId, 'signers']);
      return this;
    }

    limits(accountId) {
      this.filter.push(['accounts', accountId, 'limits']);
      return this;
    }

    signer(accountId, signerId) {
      this.filter.push(['accounts', accountId, 'signers', signerId]);
      return this;
    }

    accountSummary(accountId, since, to) {
      this.filter.push(['accounts', accountId, 'summary']);
      this.url.addQuery('since', since);
      this.url.addQuery('to', to);
      return this;
    }

    offer(accountId, offerId) {
      this.filter.push(['accounts', accountId, 'offers']);
      this.url.addQuery('offer_id', offerId);
      return this;
    }

    payments (accountId) {
      this.filter.push(['accounts', accountId, 'payments']);
      return this;
    }

    forReference (reference) {
      this.url.addQuery('reference', reference);
      return this;
    }
}
