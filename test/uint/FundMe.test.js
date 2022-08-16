const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
// Note that function in describe should not be defined as async function
!developmentChains.includes(network.name)
    ? describe.skip // to skip the whole describe chunk
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          let user
          let mockV3Aggregator
          let sendValue = ethers.utils.parseEther("1", "ether")

          beforeEach(async () => {
              // deploy our fundMe contract
              // using hardhat-deploy

              // const accounts = await ethers.getSigners()
              // const deployer = accounts[0]

              deployer = (await getNamedAccounts()).deployer
              user = (await getNamedAccounts()).user

              // tags["all"] => deploy all the deployments scripts every time
              await deployments.fixture(["all"])
              // getContract will get the latest one
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor testing", async () => {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })

              it("sets the deployer as the contract's owner correctly", async () => {
                  const response = await fundMe.getOwner()
                  assert.equal(response, deployer)
              })
          })

          describe("fund functionality", async () => {
              it("Fails if you don't send enough ETH", async () => {
                  const minimumUsd = await fundMe.MINIMUM_USD()
                  await expect(fundMe.fund({ value: 0 })).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              // partial testing syntax: "test --grep "key-words(e.g. amount of funded)" "
              it("updated the amount of funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getFunder(0)
                  assert.equal(response, deployer)
              })
          })

          describe("withdraw functionality", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })
              it("only owner can call withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[2]
                  )

                  await expect(fundMeConnectedContract.cheaperWithdraw()).to.be
                      .reverted
              })

              it("contract funds with single funder can be withdrawn by the owner", async () => {
                  const provider = fundMe.provider

                  // Arrange
                  const startingFundMeBalance = await provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBalance = await provider.getBalance(
                      deployer
                  )
                  // Act
                  const transactionResposne = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResposne.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance = await provider.getBalance(
                      deployer
                  )
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("multiple funders mode withdrawing test", async () => {
                  // Arrage
                  const provider = fundMe.provider
                  const accounts = await ethers.getSigners()

                  for (let i = 1; i < 6; i++) {
                      // contract.connect() will connect the contract to a specific provider or signer
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      sendValue = ethers.utils.parseEther(
                          (i + 1).toString(),
                          "ether"
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance = await provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBalance = await provider.getBalance(
                      deployer
                  )
                  // Act
                  const transactionResposne = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResposne.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance = await provider.getBalance(
                      deployer
                  )

                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  // Make sure that the mapping funders were reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 0; i < 6; i++) {
                      const response = await fundMe.getAddressToAmountFunded(
                          accounts[i].address
                      )
                      assert.equal(response, 0)
                  }
              })
          })
      })
