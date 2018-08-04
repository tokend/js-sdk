import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class LimitsUpdateRequestsCallBuilder extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link LimitsUpdateRequestsCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper#limits_updates}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/limits_updates');
    }

    /**
     * Filters limits_updates by documentHash.
     * @param {string} documentHash
     * @returns {LimitsUpdateRequestsCallBuilder}
     */
    forDocumentHash(documentHash) {
        this.url.addQuery('document_hash', documentHash);
        return this;
    }
}