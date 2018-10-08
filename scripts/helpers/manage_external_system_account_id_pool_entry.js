const StellarSdk = require('../../lib/index');

function createExternalSystemAccountIdPoolEntry(testHelper, externalSystemType, data, parent) {
    let operation = StellarSdk.ManageExternalSystemAccountIdPoolEntryBuilder.createExternalSystemAccountIdPoolEntry({
        externalSystemType: externalSystemType,
        data: data,
        parent: parent
    });
    return testHelper.server.submitOperationGroup([operation], testHelper.master.accountId(), testHelper.master)
        .then(response => {
            let result = StellarSdk.xdr.TransactionResult.fromXDR(new Buffer(response.result_xdr, "base64"));
            let id = result.result().results()[0].tr().manageExternalSystemAccountIdPoolEntryResult().success().poolEntryId().toString();
            console.log("PoolEntry created: " + id);
            return id;
        })
}

function deleteExternalSystemAccountIdPoolEntry(testHelper, poolEntryId) {
    let operation = StellarSdk.ManageExternalSystemAccountIdPoolEntryBuilder.deleteExternalSystemAccountIdPoolEntry({
       poolEntryId: poolEntryId
    });
    return testHelper.server.submitOperationGroup([operation], testHelper.master.accountId(), testHelper.master);
}

module.exports = {
    createExternalSystemAccountIdPoolEntry,
    deleteExternalSystemAccountIdPoolEntry
};