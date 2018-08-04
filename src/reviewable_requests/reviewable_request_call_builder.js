import {CallBuilder} from "../call_builder";

export class ReviewableRequestCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link ReviewableRequestCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use ReviewableRequests subclasses.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
    }

    /**
     * Provides information on a single reviewable request. Note: does not check request type.
     * @param id Reviewable request ID
     * @returns {LedgerCallBuilder}
     */
    reviewableRequest(id) {
        this.filter.push(['requests', id.toString()]);
        return this;
    }

    /**
     * Filters reviewable requests by reviewer
     * @param {string} reviewer For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
     * @returns {ReviewableRequestCallBuilder}
     */
    forReviewer(reviewer) {
        this.url.addQuery('reviewer', reviewer);
        return this;
    }

    /**
     * Filters reviewable requests by requestor
     * @param {string} requestor For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
     * @returns {ReviewableRequestCallBuilder}
     */
    forRequestor(requestor) {
        this.url.addQuery('requestor', requestor);
        return this;
    }

    /**
     * Filters reviewable requests by state
     * @param {number} state For example: Pending: 1, Canceled: 2, Approved: 3, Rejected: 4, PermanentlyRejected: 5
     * @returns {ReviewableRequestCallBuilder}
     */
    forState(state) {
        this.url.addQuery('state', state);
        return this;
    }

    forType(requestType) {
        this.url.addQuery('request_type', requestType);
        return this;
    }

}
