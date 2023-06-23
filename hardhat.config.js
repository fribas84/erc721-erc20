require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: __dirname + "/.env" });

const { MUMBAI_ALCHEMY, MUMBAI_PRIVATE, POLYGONAPISCAN } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.2",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/Ksye6vE3g2_wDyTxGyjMQvw2uhu9GTRh`,
      accounts: [MUMBAI_PRIVATE],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONAPISCAN,
    },
  },
};
