import {CallBuilder} from "./call_builder";

export class KeyValueCallBuilder extends CallBuilder{
    /**
     * Creates a new {@link KeyValueCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#keyValue}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('keyvalue');
    }

    keyValueByKey(key) {
        this.filter.push(['keyvalue', key]);
        return this;
    }
}