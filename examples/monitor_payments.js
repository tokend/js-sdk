const StellarSdk = require('../lib/index');
// set network passphrase for staging
StellarSdk.Network.use(new StellarSdk.Network("SUN Staging Network ; December 2017"));
// create server instance - helper to communicate with the network
let server = new StellarSdk.Server("https://api.tokend.io", { allowHttp: false });
let myAccountKP = StellarSdk.Keypair.fromSecret("SAA4QWGWYOQKXUMULSRVZMW22QN4UP4BI5F72ZB7R5CD4CH6XAEV4TQU")

// load all the payments from the beging of time. Call with signature - as we are trying to get some private info
// - need to prove that we are allowed to access it
server.payments().forAccount(myAccountKP.accountId()).callWithSignature(myAccountKP).then(response => {
    let records = response.records;
    for (var i = 0, len = records.length; i < len; i++) {
        let payment = records[i];
        // skip all other operations like issuance, withdrawal etc.
        if (payment.type_i != StellarSdk.xdr.OperationType.payment().value) {
            continue;
        }
        // make sure that it's incoming payment
        if (payment.from == myAccountKP.accountId()) {
            continue;
        }

        console.log(payment);
}
})
