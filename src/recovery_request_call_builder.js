import {CallBuilder} from "./call_builder";

export class RecoveryRequestCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link RecoveryRequestRequestCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#RecoveryRequests}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('recoveries');
    }
}
