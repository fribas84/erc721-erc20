/* eslint-disable no-undef */
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2] = await ethers.getSigners();

    const myToken = await hre.ethers.deployContract("MyToken", []);
    await myToken.waitForDeployment();
    const myTokenAddress = myToken.target;

    const faucet = await hre.ethers.deployContract("Faucet", [myTokenAddress]);
    await faucet.waitForDeployment();
    const faucetAddress = faucet.target;
    await myToken.setFaucet(faucetAddress);
    return { myToken, faucet, owner, user, user2 };
  }

  describe("Deployment", function () {
    it("Deploy", async function () {
      const { faucet, owner } = await loadFixture(deployFixture);
      const address = await faucet.owner();
      expect(address).to.equal(owner.address);
    });

    it("Faucet should be able to mint tokens to user", async function () {
      const { myToken, faucet, user } = await loadFixture(deployFixture);
      const userBalance = await myToken.balanceOf(user);
      expect(userBalance).to.equal(0);
      await faucet.connect(user).requestTokens();
      expect(await myToken.balanceOf(user)).to.equal(
        ethers.parseEther("10000")
      );
    });
  });

  describe("Request Tokens", function () {
    it("Faucet should be able to mint tokens to user", async function () {
      const { myToken, faucet, user } = await loadFixture(deployFixture);
      const userBalance = await myToken.balanceOf(user);
      expect(userBalance).to.equal(0);
      await faucet.connect(user).requestTokens();
      expect(await myToken.balanceOf(user)).to.equal(
        ethers.parseEther("10000")
      );
    });

    it("User should not be able to request tokens before timelock expires", async function () {
      const { myToken, faucet, user } = await loadFixture(deployFixture);
      const userBalance = await myToken.balanceOf(user);
      expect(userBalance).to.equal(0);
      await faucet.connect(user).requestTokens();
      expect(await myToken.balanceOf(user)).to.equal(
        ethers.parseEther("10000")
      );
      await expect(
        faucet.connect(user).requestTokens()
      ).to.revertedWith("You can only request once per day");
    });

    it("User should be able to request tokens after timelock expires", async function () {
      const { myToken, faucet, user } = await loadFixture(deployFixture);
      const userBalance = await myToken.balanceOf(user);
      expect(userBalance).to.equal(0);
      await faucet.connect(user).requestTokens();
      expect(await myToken.balanceOf(user)).to.equal(
        ethers.parseEther("10000")
      );
      await ethers.provider.send("evm_increaseTime", [129600]); //set EVM 1.5 ahead
      await faucet.connect(user).requestTokens();
      expect(await myToken.balanceOf(user)).to.equal(
        ethers.parseEther("20000")
      );
    });

  });
});
