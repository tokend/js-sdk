import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class AtomicSwapRequestsCallBuilder
    extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link AtomicSwapRequestsCallBuilder}
     * pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use
     * {@link Server#reviewableRequestsHelper#atomic_swaps}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/atomic_swaps');
    }
}
