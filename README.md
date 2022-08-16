# Hardhat FundMe Backend

## Environment Setting-up

Noting that `hardhat.config.js` is the entry point for each .js file,
then remeber to import packages by the "require" syntax in the configuration file.

---

In this project, we will use the package [**hardhat-deploy**](https://github.com/wighawag/hardhat-deploy) to facilitate the process of contracts deployment, testing and other excellent functions. The package can be added to your working context by the following action:

```shell
yarn add --dev hardhat-deploy
```

where the official docs for its utilization can be found: [https://github.com/wighawag/hardhat-deploy](https://github.com/wighawag/hardhat-deploy) 

If you are using `ethers.js` we recommend you also install `hardhat-deploy-ethers` which add extra features to access deployments as ethers contract. 

Since `hardhat-deploy-ethers` is a fork of `@nomiclabs/hardhat-ethers` and that other plugin might have an hardcoded dependency on `@nomiclabs/hardhat-ethers` the best way to install `hardhat-deploy-ethers` and ensure compatibility is the following:

```shell
yarn add --dev  @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
```


### Installing libraries defined in smart contracts

---

For example 

```shell
"The library @chainlink/contracts, imported from contracts/FundMe.sol, is not installed. Try installing it using npm."
```

Solution: 

```shell
yarn add --dev @chainlink/contracts
```

yarn add --dev  @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers

Which means you then need to do require("@nomiclabs/hardhat-ethers") instead of require("hardhat-deploy-ethers") in your hardhat.config.js file.


### Networks

Note that hardhat local chains and `mainnet forking chains are temporary as they are destoryed instantly at the completment of codes.

---
## Usage of hardhat-deploy

### Configuration

1. Create a new folder called `deploy` where the executions of running `yarn hardhat deploy` will be defined

### How to configure the version of solidity when there exist different version of solidity files to be compiled?

---

In `hardhat.config.js` file, one can change the configuration of solidity from one value (e.g. "^0.8.0") to a mapping object.