import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";

export class AtomicSwapBidCreationRequestsCallBuilder
    extends ReviewableRequestCallBuilder {
    /**
     * Creates a new {@link AtomicSwapBidCreationRequestsCallBuilder}
     * pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use
     * {@link Server#reviewableRequestsHelper#atomic_swap_bids}.
     * @constructor
     * @extends ReviewableRequestCallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('request/atomic_swap_bids');
    }
}
