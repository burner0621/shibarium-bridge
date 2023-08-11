const HDWalletProvider = require("@truffle/hdwallet-provider");
const env = require("./env.js")

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
        },
        goerli: {
            provider: function () {
                return new HDWalletProvider(env.MNEMONICS, 'https://goerli.infura.io/v3/' + env.INFURA_API_KEY, 0, 3)
            },
            network_id: 5,
            gas: 5000000,
            gasPrice: 20000000000,
            timeoutBlocks: 200,
            networkCheckTimeout: 999999,
            skipDryRun: true// skipDryRun:      true,
            // pollingInterval: 60000,
        },
        matic: {
            provider: () => new HDWalletProvider(env.MNEMONICS, `https://rpc-mumbai.maticvigil.com`, 0, 3),
            network_id: 80001,
            confirmations: 2,
            timeoutBlocks: 200,
            networkCheckTimeout: 999999,
            skipDryRun: true
        },
    },
    mocha: {
        useColors: true,
        timeout: 10 * 1000,
        slow: 10 * 1000,
        reporter: "mochawesome",
        reporterOptions: {
            overwrite: true,
            inline: true,
            cdn: true,
            json: false,
            reportDir: "doc",
            reportTitle: "bridge-contract",
            reportFilename: "bridge-contract",
        },
    },
    compilers: {
        solc: {
            version: "0.8.0",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
            },
        },
    },
    plugins: ["solidity-coverage"],
};
