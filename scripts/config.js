import { isUndefined } from 'util';

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

function checkConnection(conf, done) {
    conf.server.loadAccountWithSign(conf.master.accountId(), conf.master)
        .then(source => {
            console.log('Horizon up and running!');
            done();
        })
        .catch(err => {
            console.log(err);
            console.log("Couldn't connect to Horizon... Trying again.");
            setTimeout(() => checkConnection(conf, done), 20000);
        });
}

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
            },

            handleError: function (err, done) {
                if (!isUndefined(err.response)) {
                    done(JSON.stringify(err.response.data));
                    return;
                }

                done(err);
            },

            generateAssetCode: function(prefix) {
                return prefix + Math.floor(Math.random() * 100000);
            }
        };

        StellarSdk.Network.use(new StellarSdk.Network(config.networkPassphrase));
        config.server = new StellarSdk.Server(config.url, { allowHttp: true });

        return config
    },

    getDefaultTestConfig: function (testCase) {
        const TIMEOUT = 60 * 20000;
        testCase.timeout(TIMEOUT);
        testCase.slow(TIMEOUT / 2);

        let testHelper = this.getConfig('local');
        before(function (done) {
            this.timeout(60 * 1000);
            checkConnection(testHelper, done);
        });
        return testHelper;
    },
};
