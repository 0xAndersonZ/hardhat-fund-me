/**
 * When running "yarn hardhat deploy", it will automatically run a default function defined in this script.
 * see: https://github.com/wighawag/hardhat-deploy#an-example-of-a-deploy-script-
 */

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig

// Way 1
// async function deployFun(hre) {
//     // fetch getNamedAccounts and deployments from the hardhat running environment
//     const { getNamedAccounts, deployments } = hre
//     // hre.getNamedAccounts()
//     // hre.deployments()
//     console.log("Hi!")
// }
// module.exports.default = deployFun

// Way 2
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    // deployer is a "named account" defined in the hardhat.config.js file
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeedAddress
    }

    // Mocking: if the contract doesn't exist, we deploy a minimal version of it
    // for our local testing.

    // when going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // constructor arguments
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        // await verify(fundMe.address, args)
        log("The verification is forbidden now.")
    }
    log(
        "--------------------------------------------------------------------------------"
    )
}

module.exports.tags = ["all", "fundme"]
