let masterSeeds = require('./master_seeds');
const StellarSdk = require('../lib/index');
const _ = require('lodash');

var admins = {
    // supported value keys:
    // * identity:int
    // * weight:int
    // * type:int
    // * name:str
    local: {},
    dev: _.mapValues(
        {},
        details => ({
            identity: details.identity,
            weight: details.weight || 255,
            type: details.type || 2147483647,
            name: details.name || `Admin ${details.identity}`
        })),
    staging: _.mapValues(
        {},
        details => ({
            identity: details.identity,
            weight: details.weight || 255,
            type: details.type || 2147483647,
        })),
}

const passphrases = {
    local: 'Test SDF Network ; September 2015'
}

const urls = {
    local: 'http://127.0.0.1:8000'
}

//env is one of the {'local', 'dev', 'staging'}

module.exports = {
    getConfig: function (env) {
        const config = {
            url: urls[env],
            networkPassphrase: passphrases[env],
            master: StellarSdk.Keypair.fromSecret(masterSeeds[env]),
            issuance: StellarSdk.Keypair.fromSecret(masterSeeds[env]),
            admins: admins[env],
            thresholds: {
                master: 255,
                high: 100,
            }
        };

        StellarSdk.Network.use(new StellarSdk.Network(config.networkPassphrase));
        config.server = new StellarSdk.Server(config.url, { allowHttp: true });

        return config
    }
};
