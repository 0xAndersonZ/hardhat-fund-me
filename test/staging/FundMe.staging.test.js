const { assert } = require("chai")
const { ethers, getNamedAccounts, network } = require("hardhat")

const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
  ? describe.skip // to skip the whole describe chunk`
  : describe("FundMe staging testing", async function() {
      let deployer
      let fundMe
      const sendValue = ethers.utils.parseEther("0.1", "ether")
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
      })

      it("allow users to fund and withdraw", async () => {
        const txFundResponse = await fundMe.fund({
          value: sendValue
        })
        await txFundResponse.wait(1)

        console.log(await fundMe.provider.getBalance(fundMe.address))

        const txWithdrawResponse = await fundMe.withdraw()
        await txWithdrawResponse.wait(1)

        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        )

        console.log(
          endingFundMeBalance.toString() +
            "should equal 0, running assert testing"
        )
        assert.equal(endingFundMeBalance.toString(), "0")
      })
    })
