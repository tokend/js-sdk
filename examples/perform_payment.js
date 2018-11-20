const StellarSdk = require('../lib/index');

function findBalanceByAsset(balances, asset) {
    for (var i = 0; i < balances.length; i++) {
        if (balances[i].asset === asset) {
            return balances[i].balance_id;
        }
    }

    throw new Error("Failed to find balance for specified asset");
}

// set network passphrase for staging
StellarSdk.Network.use(new StellarSdk.Network("SUN Staging Network ; December 2017"));
// create server instance - helper to communicate with the network
let server = new StellarSdk.Server("https://api.tokend.io", { allowHttp: false });
let myAccountKP = StellarSdk.Keypair.fromSecret("SAA4QWGWYOQKXUMULSRVZMW22QN4UP4BI5F72ZB7R5CD4CH6XAEV4TQU");
let destinationAccountID = "GDS67HI27XJIJEL7IGHVJVNHPXZLMW6F3O45OXIMKAUNGIR2ROBUKTT4";
let asset = "SUN";
// find balance ID of destination for asset
server.accounts().balances(destinationAccountID).call().then(balances => {
    return findBalanceByAsset(balances, asset);
}).then(destinationBalanceId => {
    var paymentOp = StellarSdk.Operation.payment({
        sourceBalanceId: "BAIMQCF3BQCD6DV74SJBSULP2D2HNWZAQLS5UUY3MTP5Y6UHOBUBUNRD",
        destinationBalanceId: destinationBalanceId,
        // amount we want to send,
        amount: "10.5",
        // for simplicity lets assume that we have 0 fees for both sender and receiver
        feeData: {
            sourceFee: {
                paymentFee: "0",
                fixedFee: "0",
            },
            destinationFee: {
                paymentFee: "0",
                fixedFee: "0",
            }
        },
        // can be used to ensure that you've not processed same transfer twice
        reference: "my_unique_refence" + Math.floor(Math.random() * 1000),
        subject: "Thanks for help with testing",
    });
    // create tx from operation, sign it and submit
    return server.submitOperation(paymentOp, myAccountKP.accountId(), myAccountKP);
}).then(() => {
    console.log("Payment has been performed");
}).catch(err => {
    console.log("Oops...");
    console.log(err);
})
