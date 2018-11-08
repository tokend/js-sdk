import { CallBuilder } from "./call_builder";

export class InvestmentTokenSalesCallBuilder extends CallBuilder {
    /**
     * Creates a new {@link InvestmentTokenSalesCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#callBuilder#investmentTokenSales}.
     * @constructor
     * @extends CallBuilder
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverUrl) {
        super(serverUrl);
        this.url.segment('investment_token_sales');
    }

    /**
   * Filters sales by asset
   * @param {string} asset For example: `USD`
   * @returns {InvestmentTokenSalesCallBuilder}
   */
    forBaseAsset(asset) {
        this.url.addQuery('base_asset', asset);
        return this;
    }

    /**
     * Provides information on a single sale.
     * @param {string} id Sale ID
     * @returns {InvestmentTokenSalesCallBuilder}
     */

    sale(id) {
        this.filter.push(['investment_token_sales', id.toString()]);
        return this;
    }

    /**
     * Filters sales by owner
     * @param {string} owner For example: `GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN`
     * @returns {InvestmentTokenSalesCallBuilder}
     */

    forOwner(owner) {
        this.url.addQuery('owner', owner);
        return this;
    }

      /**
   * Filters sales by open state
   * @param {boolean} openOnly
   * @return {InvestmentTokenSalesCallBuilder}
   */
      openOnly(openOnly = true) {
        this.url.addQuery('open_only', openOnly);
        return this;
      }

      /**
   * Filters sales by name
   * @param {string} name For example: `awesome sale`
   * @returns {InvestmentTokenSalesCallBuilder}
   */
  forName(name) {
    this.url.addQuery('name', name);
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
  sortByEndTime() {
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
   * Sort sales in the order when a sale with latest date
   * of creation will be the first.
   */
  sortByStartTime() {
    this.url.addQuery('sort_by', 4);
    return this;
  }

  /**
   * Sort sales in the order when a sale with latest date
   * of trading start will be the first.
   */
  sortByTradingStartDate() {
    this.url.addQuery('sort_by', 5);
    return this;
  }

  /**
   * Sort sales in the order when a sale with latest date
   * of settlements start will be the first.
   */
  sortBySettlementsStartDate() {
    this.url.addQuery('sort_by', 6);
    return this;
  }

  /**
   * Sort sales in the order when a sale with latest date
   * of settlements end will be the first.
   */
  sortBySettlementsEndDate() {
    this.url.addQuery('sort_by', 7);
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
