const helpers = require('./../helpers');
const config = require('../config')
const StellarSdk = require('../../lib/index');
const reviewableRequestHelper = require('../../scripts/helpers/review_request')
const assetHelper = require('../../scripts/helpers/asset')
const accountsHelper = require('../../scripts/helpers/accounts')

let env = 'dev';
let currentConfig = config.getConfig(env);

let signer = StellarSdk.Keypair.fromSecret('SBU72E4TBLKWB3PRU2GLELZEVXGIKVWHXCWQV353SPG2OAQYHKDFJ26R');


//assetHelper.createAssetPair(currentConfig, 'OLE', 'SUN', "1").then(()=> {console.log("success")}).catch(helpers.errorHandler);

/*currentConfig.server.submitOperation(StellarSdk.Operation.manageAccount({
    account: "GD2H6LZKMBXX6USCZCHIKN5S6Z2JIVYAR2ZAVWTUOORSGEOBIKXDCUYV",
    accountType: 2,
    blockReasonsToAdd: 4,
}),  "GDA3SCPLGNMXAARU5XXHNIUCHG554TESWZOKQZL4EOY2HPJRPLMW7VEB", signer).then(()=> {console.log("success")}).catch(helpers.errorHandler);*/



//let syndicateKP = StellarSdk.Keypair.fromSecret('SC3VKS3ARXLQAD37XGF6K7JDJ3VHBPUUWCLNSENF4BUFAKRD3TCZWMJL');
/*reviewableRequestHelper.reviewWithdrawRequest(currentConfig, "737", signer, StellarSdk.xdr.ReviewRequestOpAction.approve().value,
                                    "", { one_step_withdrawal: "" }, StellarSdk.xdr.ReviewableRequestType.withdraw().value).then(()=> console.log("OK")).catch(err => {
                                    console.log(JSON.stringify(err.response.data))
                                    });*/

let superAdminKP = StellarSdk.Keypair.fromSecret('SAJSOWPZNGBCKHDEB5RP7EV6KZSQA5ANVUMYKHR4CNVN2LQ6KOXZZB3B');
accountsHelper.addSuperAdmin(currentConfig, 'GDF6CDA63MU2IW6CQJPNOYEHQBHFF2XNHAPLR6ZUOJP3SBQRKROZFO7Z', superAdminKP, 'GAO5PXP5IC7IJ4EQ5ARRZRZPF36NSXCB7V2TAOF4YT5I64EQN6JRYAH3', {
    name: 'Auto KYC review',
    type: 16777216,
    weight: 255,
    identity: 1,
}).then(()=> console.log("OK")).catch(err => {
                                    console.log(JSON.stringify(err.response.data))
                                    });