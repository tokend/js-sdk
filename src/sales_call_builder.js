import {CallBuilder} from "./call_builder";

export class SalesCallBuilder extends CallBuilder {
  /**
   * Creates a new {@link SalesCallBuilder} pointed to server defined by serverUrl.
   *
   * Do not create this object directly, use {@link Server#sales}.
   * @constructor
   * @extends CallBuilder
   * @param {string} serverUrl Horizon server URL.
   */
  constructor(serverUrl) {
    super(serverUrl);
    this.url.segment('sales');
  }

  /**
   * Provides information on a single sale.
   * @param {string} id Sale ID
   * @returns {SalesCallBuilder}
   */

  sale(id) {
    this.filter.push(['sales', id.toString()]);
    return this;
  }

  /**
   * Filters sales by asset
   * @param {string} asset For example: `USD`
   * @returns {SalesCallBuilder}
   */
  forBaseAsset(asset) {
    this.url.addQuery('base_asset', asset);
    return this;
  }

  /**
   * Filters sales by owner
   * @param {string} owner For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
   * @returns {SalesCallBuilder}
   */

  forOwner(owner) {
    this.url.addQuery('owner', owner);
    return this;
  }

  /**
   * Filters sales by open state
   * @param {boolean} openOnly
   * @return {SalesCallBuilder}
   */
  openOnly(openOnly = true) {
    this.url.addQuery('open_only', openOnly);
    return this;
  }

  /**
   * Filter sales which will start soon.
   * @param {boolean} upcoming
   * @return {SalesCallBuilder}
   */
  upcoming(upcoming = true) {
    this.url.addQuery('upcoming', upcoming);
    return this;
  }

  /**
   * Filters sales by name
   * @param {string} name For example: `awesome sale`
   * @returns {SalesCallBuilder}
   */
  forName(name) {
    this.url.addQuery('name', name);
    return this;
  }

  /**
   * Filter sales in which the current сap exceeds 
   * the specified percentage `bound` of the soft cap.
   * @param {Number} bound - percent value from 0 to 100
   */
  currentSoftCapsRatio(bound = 0) {
    if (bound < 0 || bound > 100) {
      throw new Error("bound value is out of range 0 <= x <= 100");
    }

    this.url.addQuery('current_soft_caps_ratio', bound);
    return this;
  }

  /**
   * Filter sales in which the current сap exceeds `collectedValueBound`.
   * @param {number} collectedValueBound - lower bound of the current cap.
   * @returns {SalesCallBuilder}
   */
  withCollectedValueBound(collectedValueBound = 0) {
    this.url.addQuery('collected_value_bound', collectedValueBound);
    return this;
  }

  /**
   * Sort types:
   * 1 - most founded;
   * 2 - end time.
   * 3 - popularity;
   * NOTE! If `sort_by` flag set, paging params 
   * will be ignored, and pagination will not work.
   */
  
   /**
   * Sort sales in order when sale with 
   * bigger current cap will be first.
   */
  sortByMostFounded() {
    this.url.addQuery('sort_by', 1);
    return this;
  }

  /**
   * Sort sales in order when sale with 
   * the closest end time will be first.
   */
  sortByEndType() {
    this.url.addQuery('sort_by', 2);
    return this;
  }

  /**
   * Sort sales in the order when a sale with 
   * a large number of unique investors will be the first.
   */
  sortByPopularity() {
    this.url.addQuery('sort_by', 3);
    return this;
  }
  
  /**
   *  Sort sales with provided type
   */
  sortBy (type) {
    this.url.addQuery('sort_by', type);
    return this;
  }
}
