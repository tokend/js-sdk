const StellarSdk = require('../../lib/index');

function putKeyValue(testHelper, source, key, value, entryType) {
    let opts = {
        key: key,
        value: value,
        entryType: entryType
    };
    let operation = StellarSdk.ManageKeyValueBuilder.putKeyValue(opts);
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
}

function deleteKeyValue(testHelper, source, key) {
    let operation = StellarSdk.ManageKeyValueBuilder.deleteKeyValue({
        key: key
    });
    return testHelper.server.submitOperationGroup([operation], source.accountId(), source);
}

module.exports = {
    putKeyValue,
    deleteKeyValue
};
