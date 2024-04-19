// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const myNFT = await hre.ethers.deployContract("MyNFT", [
    "Crypto Certificate",
    "crycert",
  ]);
  await myNFT.waitForDeployment();
  console.log("NFT Contract Deployed to: ", myNFT.target);

  const myToken = await hre.ethers.deployContract("MyToken");
  await myToken.waitForDeployment();
  console.log("MyToken Contract Deployed to: ", myToken.target);

  const faucet = await hre.ethers.deployContract("Faucet", [myToken.target]);
  await faucet.waitForDeployment();
  await myToken.setFaucet(faucet.target);
  console.log("Faucet Contract Deployed to: ", faucet.target);

  const etherWallet = await hre.ethers.deployContract("EtherWallet", [
    myToken.target,
  ]);
  await etherWallet.waitForDeployment();
  console.log("EtherWallet Contract Deployed to: ", etherWallet.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
