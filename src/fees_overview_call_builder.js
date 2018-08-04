import {CallBuilder} from "./call_builder";

export class FeesOverviewCallBuilder extends CallBuilder {

  constructor(serverUrl) {
    super(serverUrl);
    this.url.segment('fees_overview');
  }

  /**
   * This endpoint represents fee for particular feeType and asset.
   * @param {int} like enum FeeType
   * @param {string} like XBU
   * @returns {FeeCallBuilder}
   */
}
