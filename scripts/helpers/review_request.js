const isUndefined = require('lodash/isUndefined');
const StellarSdk = require('../../lib/index');


function loadRequestWithRetry (testHelper, requestID, reviewerKP, requestType) {
    let callBuilder = testHelper.server.reviewableRequestsHelper().request().reviewableRequest(requestID);
    if (!isUndefined(requestType)) {
        callBuilder = callBuilder.forType(requestType);
    }
    return callBuilder.callWithSignature(reviewerKP).catch(err => {
        if (!isUndefined(err.response) && err.response.status === 404) {
            console.log("received 404 for reviewable request - retrying");
            return new Promise(resolve => setTimeout(resolve, 2000)).then(() => loadRequestWithRetry(testHelper, requestID, reviewerKP));
        }
        throw err;
    });
}

function reviewRequest(testHelper, requestID, reviewerKP, action, rejectReason, requestType, tasksToAdd = 0,
                       tasksToRemove = 0, externalDetails = {comment: 'All right'}) {
    return loadRequestWithRetry(testHelper, requestID, reviewerKP, requestType).then(request => {
        let opts = {
            requestID: requestID,
            requestHash: request.hash,
            requestType: request.details.request_type_i,
            action: action,
            reason: rejectReason,
            tasksToAdd: tasksToAdd,
            tasksToRemove: tasksToRemove,
            externalDetails: externalDetails
        };
        let operation = StellarSdk.ReviewRequestBuilder.reviewRequest(opts);
        return testHelper.server.submitOperationGroup([operation], reviewerKP.accountId(), reviewerKP);
    }).catch(err => {
        if (!isUndefined(err.response) && err.response.status === 404) {
            console.log("received 404 - retrying");
            return new Promise(resolve => setTimeout(resolve, 2000)).then(() => reviewRequest(testHelper, requestID, reviewerKP, action, rejectReason));
        }
        throw err;
    });
}

function reviewWithdrawRequest(testHelper, requestID, reviewerKP, action, rejectReason, externalDetails, requestType) {
    return loadRequestWithRetry(testHelper, requestID, reviewerKP, requestType).then(request => {
        let opts = {
            requestID: requestID,
            requestHash: request.hash,
            requestType: request.details.request_type_i,
            action: action,
            reason: rejectReason,
            externalDetails: externalDetails,
        };
        let operation = StellarSdk.ReviewRequestBuilder.reviewWithdrawRequest(opts);
        return testHelper.server.submitOperationGroup([operation], reviewerKP.accountId(), reviewerKP);
    }).catch(err => {
        if (!isUndefined(err.response) && err.response.status === 404) {
            console.log("received 404 - retrying");
            return new Promise(resolve => setTimeout(resolve, 2000)).then(() => reviewRequest(testHelper, requestID, reviewerKP, action, rejectReason, requestType));
        }
        throw err;
    });
}

function reviewTwoStepWithdrawRequest(testHelper, requestID, reviewerKP, action, rejectReason, externalDetails) {
    return loadRequestWithRetry(testHelper, requestID, reviewerKP).then(request => {
        let opts = {
            requestID: requestID,
            requestHash: request.hash,
            requestType: request.details.request_type_i,
            action: action,
            reason: rejectReason,
            externalDetails: externalDetails,
        };
        let operation = StellarSdk.ReviewRequestBuilder.reviewTwoStepWithdrawRequest(opts);
        return testHelper.server.submitOperationGroup([operation], reviewerKP.accountId(), reviewerKP);
    }).catch(err => {
        if (!isUndefined(err.response) && err.response.status === 404) {
            console.log("received 404 - retrying");
            return new Promise(resolve => setTimeout(resolve, 2000)).then(() => reviewRequest(testHelper, requestID, reviewerKP, action, rejectReason));
        }
        throw err;
    });
}

function reviewLimitsUpdateRequest(testHelper, requestID, reviewerKP, action, rejectReason, newLimits) {
    return loadRequestWithRetry(testHelper, requestID, reviewerKP).then(request => {
        let opts = {
            requestID: requestID,
            requestHash: request.hash,
            requestType: request.details.request_type_i,
            action: action,
            reason: rejectReason,
            newLimits: newLimits,
        };
        let operation = StellarSdk.ReviewRequestBuilder.reviewLimitsUpdateRequest(opts);
        return testHelper.server.submitOperationGroup([operation], reviewerKP.accountId(), reviewerKP);
    }).catch(err => {
        if (!isUndefined(err.response) && err.response.status === 404) {
            console.log("received 404 - retrying");
            return new Promise(resolve => setTimeout(resolve, 2000)).then(() => reviewRequest(testHelper, requestID, reviewerKP, action, rejectReason));
        }
        throw err;
    });
}

function reviewAmlAlertRequest(testHelper, requestID, reviewerKP, action, rejectReason, comment) {
    return loadRequestWithRetry(testHelper, requestID, reviewerKP).then(request => {
        let opts = {
            requestID: requestID,
            requestHash: request.hash,
            requestType: request.details.request_type_i,
            action: action,
            reason: rejectReason,
            comment: comment,
        };
        let operation = StellarSdk.ReviewRequestBuilder.reviewAmlAlertRequest(opts);
        return testHelper.server.submitOperation(operation, reviewerKP.accountId(), reviewerKP);
    }).catch(err => {
        if (!isUndefined(err.response) && err.response.status === 404) {
            console.log("received 404 - retrying");
            return new Promise(resolve => setTimeout(resolve, 2000)).then(() => reviewRequest(testHelper, requestID, reviewerKP, action, rejectReason));
        }
        throw err;
    });
}

function reviewUpdateKYCRequest(testHelper, requestID, reviewerKP, action, rejectReason, tasksToAdd, tasksToRemove, externalDetails) {
    return loadRequestWithRetry(testHelper, requestID, reviewerKP).then(request => {
        let opts = {
            requestID: requestID,
            requestHash: request.hash,
            requestType: request.details.request_type_i,
            action: action,
            reason: rejectReason,
            tasksToAdd: tasksToAdd,
            tasksToRemove: tasksToRemove,
            externalDetails: externalDetails,
        };
        let operation = StellarSdk.ReviewRequestBuilder.reviewUpdateKYCRequest(opts);
        return testHelper.server.submitOperation(operation, reviewerKP.accountId(), reviewerKP);
    }).catch(err => {
        if (!isUndefined(err.response) && err.response.status === 404) {
            console.log("received 404 - retrying");
            return new Promise(resolve => setTimeout(resolve, 2000)).then(() => reviewRequest(testHelper, requestID, reviewerKP, action, rejectReason));
        }
        throw err;
    });
}

function reviewInvoiceRequest(testHelper, requestID, reviewerKP, action, rejectReason, sourceBalanceID, destBalanceID, amount, sourceFeeAsset) {
    return loadRequestWithRetry(testHelper, requestID, reviewerKP).then(request => {
        let billPayDetails = {
            sourceBalanceId: sourceBalanceID,
            destination: destBalanceID,
            amount: amount,
            feeData: {
                sourceFee: {
                    maxPaymentFee: "50",
                    fixedFee: "10",
                    feeAsset: sourceFeeAsset,
                },
                destinationFee: {
                    maxPaymentFee: "0",
                    fixedFee: "0",
                    feeAsset: sourceFeeAsset,
                },
                sourcePaysForDest: true,
            },
            subject: "Payment V2 test",
            reference: "",
        };
        let opts = {
            requestID: requestID,
            requestHash: request.hash,
            requestType: request.details.request_type_i,
            action: action,
            reason: rejectReason,
            billPayDetails: billPayDetails,
        };
        let operation = StellarSdk.ReviewRequestBuilder.reviewInvoiceRequest(opts);
        return testHelper.server.submitOperationGroup([operation], reviewerKP.accountId(), reviewerKP);
    }).catch(err => {
        if (!isUndefined(err.response) && err.response.status === 404) {
            console.log("received 404 - retrying");
            return new Promise(resolve => setTimeout(resolve, 2000)).then(() => reviewRequest(testHelper, requestID, reviewerKP, action, rejectReason));
        }
        throw err;
    });
}

function reviewContractRequest(testHelper, requestID, reviewerKP, action, rejectReason, details) {
    return loadRequestWithRetry(testHelper, requestID, reviewerKP).then(request => {
        let opts = {
            requestID: requestID,
            requestHash: request.hash,
            requestType: request.details.request_type_i,
            action: action,
            reason: rejectReason,
            details: details,
        };
        let operation = StellarSdk.ReviewRequestBuilder.reviewContractRequest(opts);
        return testHelper.server.submitOperationGroup([operation], reviewerKP.accountId(), reviewerKP);
    }).catch(err => {
        if (!isUndefined(err.response) && err.response.status === 404) {
            console.log("received 404 - retrying");
            return new Promise(resolve => setTimeout(resolve, 2000)).then(() => reviewRequest(testHelper, requestID, reviewerKP, action, rejectReason));
        }
        throw err;
    });
}

module.exports = {
    loadRequestWithRetry,
    reviewRequest,
    reviewWithdrawRequest,
    reviewTwoStepWithdrawRequest,
    reviewLimitsUpdateRequest,
    reviewUpdateKYCRequest,
    reviewAmlAlertRequest,
    reviewInvoiceRequest,
    reviewContractRequest,
}
