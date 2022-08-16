// Adding extra features to the hardhat running environment(hre)
// importing hre outside config: const{hre} = require('hardhat');

const { BigNumber } = require("ethers")

// ethers.js is included in the Hardhat Toolbox
require("dotenv").config()
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-ethers")

// require("./tasks/utils")
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const RINKEBY_RPC_URL = process.env.GOERLI_RPC_URL
const RINKEBY_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY

module.exports = {
    // solidity: "0.8.8",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
    },

    defaultNetwork: "hardhat",

    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },

    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            // GOERLI_RPC_URL,
            accounts: [GOERLI_PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
            gas: BigNumber.from(300000).hex
            // gasPrice: BigNumber.from(3e9).hex // 1 gwei
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            // GOERLI_RPC_URL,
            accounts: [RINKEBY_PRIVATE_KEY],
            chainId: 4
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337
        }
        // hardhat: {
        //     forking: {
        //         url: ETHEREUM_RPC_URL,
        //     },
        // },
    },

    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        token: "MATIC"
        // coinmarketcap: COINMARKETCAP_API_KEY
    },

    // Adding deployer, receiver, executor, hacker,...
    namedAccounts: {
        deployer: {
            default: 0, // First position in an accounts list
            5: 0 // Chain ID 5 = Goerli
        },
        receiver: {
            default: 1,
            5: 1
        },
        user: {
            default: 2
        }
    },
    mocha: {
        timeout: 100000000
    }
}
