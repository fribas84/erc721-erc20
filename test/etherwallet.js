/* eslint-disable no-undef */
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Ether Wallet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2] = await ethers.getSigners();
    const myToken = await hre.ethers.deployContract("MyToken", []);
    await myToken.waitForDeployment();
    const myTokenAddress = myToken.target;
    const etherWallet = await hre.ethers.deployContract("EtherWallet", [myTokenAddress]);
    await etherWallet.waitForDeployment();   
    return{myToken, etherWallet, owner, user, user2}; 
  }

  describe("Deployment", function () {
    it("Deploy", async function () {
      const { myToken, etherWallet, owner, user, user2 } = await loadFixture(
        deployFixture
      );
      console.log(etherWallet.target)
      console.log(await etherWallet.myToken());
      expect(await etherWallet.myToken()).to.equal(myToken.target);
    });
  });

});
