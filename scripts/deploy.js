// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {


  const myNFT = await hre.ethers.deployContract("MyNFT",["MyNFT","MNFT"]);

  await myNFT.waitForDeployment();

  console.log("Contract Deployed to: ", myNFT.target);

  await myNFT.mint("https://ipfs.io/ipfs/Qmd7gz9pE9HAct54JfsC6yhczdyrkcjff4ymTSd7CG2XBM");
  console.log("NFT Minted successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

