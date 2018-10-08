const helpers = require('./../helpers')
const StellarSdk = require('../../lib/index');
const config = require('../config')

let env = 'staging';
let currentConfig = config.getConfig(env);

let source = StellarSdk.Keypair.fromSecret("SC5HX67Q3UABEAUS3YHPXOMLSLOHY5EMJ6ERJNSY5KU2QH23LPMXJ77K");


let operation = StellarSdk.ManageAssetBuilder.assetUpdateRequest({
    requestID: "0",
    code: "ETH",
    details: {
        name: "Ethereum",
        logo: {
            key: "",
            type: "logo_type",
            url: "logo_url",
        },
        terms: {
            key: "",
            name: "",
            type: ""
        },
    },
    policies: 26,
});
currentConfig.server.submitOperation(operation, currentConfig.master.accountId(), currentConfig.master).then(() => {
    console.log("Cools");
}).catch(err => {
    console.log(err);
})