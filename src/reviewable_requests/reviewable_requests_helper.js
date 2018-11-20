import { AtomicSwapBidCreationRequestsCallBuilder } from './atomic_swap_bid_requests_call_builder';
import { AtomicSwapRequestsCallBuilder } from './atomic_swap_requests_call_builder';
import {AssetRequestsCallBuilder} from "./asset_requests_call_builder";
import {PreissuanceRequestsCallBuilder} from "./preissuance_requests_call_builder";
import {IssuanceRequestsCallBuilder} from "./issuance_requests_call_builder";
import {WithdrawalRequestsCallBuilder} from "./withdrawal_requests_call_builder";
import {SaleRequestsCallBuilder} from "./sales_requests_call_builder";
import {ReviewableRequestCallBuilder} from "./reviewable_request_call_builder";
import {LimitsUpdateRequestsCallBuilder} from "./limits_update_requests_call_builder";
import {UpdateKYCRequestCallBuilder} from './update_kyc_requests_call_builder';
import {UpdateSaleDetailsRequestCallBuilder} from './update_sale_details_requests_call_builder';
import {ContractRequestsCallBuilder} from './contract_requests_call_builder';
import {InvoiceRequestsCallBuilder} from './invoice_requests_call_builder';

let URI = require("urijs");


export class ReviewableRequestsHelper {
    /**
     * Creates a new {@link ReviewableRequestsHelper} which provides methods
     * to build specific reviewable request call builders
     *
     * Do not create this object directly, use {@link Server#reviewableRequestsHelper}.
     * @constructor
     * @param {string} serverUrl Horizon server URL.
     */
    constructor(serverURL) {
        this.serverURL = URI(serverURL);
    }

    /**
     * Returns new {@link AssetRequestsCallBuilder} object configured by a current Horizon server configuration.
     * @returns {AssetRequestsCallBuilder}
     */
    assets() {
        return new AssetRequestsCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link PreissuanceRequestsCallBuilder} object configured by a current Horizon server configuration.
     * @returns {PreissuanceRequestsCallBuilder}
     */
    preissuances() {
        return new PreissuanceRequestsCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link IssuanceRequestsCallBuilder} object configured by a current Horizon server configuration.
     * @returns {IssuanceRequestsCallBuilder}
     */
    issuances() {
        return new IssuanceRequestsCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link WithdrawalRequestsCallBuilder} object configured by a current Horizon server configuration.
     * @returns {WithdrawalRequestsCallBuilder}
     */
    withdrawals() {
        return new WithdrawalRequestsCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link SaleRequestsCallBuilder} object configured by a current Horizon server configuration.
     * @returns {SaleRequestsCallBuilder}
     */
    sales() {
        return new SaleRequestsCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link ReviewableRequestCallBuilder} object configured by a current Horizon server configuration.
     * @returns {ReviewableRequestCallBuilder}
     */
    request() {
        return new ReviewableRequestCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link LimitsUpdateRequestsCallBuilder} object configured by a current Horizon server configuration.
     * @returns {LimitsUpdateRequestsCallBuilder}
     */
    limits_updates() {
        return new LimitsUpdateRequestsCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link UpdateKYCRequestCallBuilder} object configured by a current Horizon server configuration.
     * @returns {UpdateKYCRequestCallBuilder}
     */
    update_kyc() {
        return new UpdateKYCRequestCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link UpdateSaleDetailsRequestCallBuilder} object configured by a current Horizon server configuration.
     * @returns {UpdateSaleDetailsRequestCallBuilder}
     */
    update_sale_details() {
        return new UpdateSaleDetailsRequestCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link UpdateSaleEndTimeRequestCallBuilder} object configured by a current Horizon server configuration.
     * @returns {UpdateSaleEndTimeRequestCallBuilder}
     */
    update_sale_end_time() {
        return new UpdateSaleEndTimeRequestCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link ContractRequestsCallBuilder} object configured by a current Horizon server configuration.
     * @returns {ContractRequestsCallBuilder}
     */
    contracts() {
        return new ContractRequestsCallBuilder(URI(this.serverURL));
    }

    /**
     * Returns new {@link InvoiceRequestsCallBuilder} object configured by a current Horizon server configuration.
     * @returns {InvoiceRequestsCallBuilder}
     */
    invoices() {
        return new InvoiceRequestsCallBuilder(URI(this.serverURL));
    }

    atomic_swap_bids () {
        return new AtomicSwapBidCreationRequestsCallBuilder(URI(this.serverURL));
    }

    atomic_swaps () {
        return new AtomicSwapRequestsCallBuilder(URI(this.serverURL));
    }
}
