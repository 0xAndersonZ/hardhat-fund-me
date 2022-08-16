/**
 * @description a general js file to deploy contracts on EVM-compatible networks
 * @param {*} contractName - the name of the contract stored under the `contracts` folder
 * @param {*} constructorArgs - any arguments that should be passed to the contracts' constructor, format in []
 * @dev the general process of deploying a contract is as follows:
 *         - define a provider (e.g. ethers.providers.JsonRpcProvider) to connect to a full node of the EVM network
 *         - specify the address of the deployer account (e.g. ethers.Wallet)
 *         - deploy the contract (e.g. deploy(contractName, { from: deployer, args: constructorArgs }))
 *         - and override any necessary parameters in defining a "transaction" object
 */
async function deploy(contractName, constructorArgs) {
    let provider
    let deployer
}
