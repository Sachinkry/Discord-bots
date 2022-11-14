const { privateDecrypt } = require("crypto");

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path: ".env"});

const ALCHEMY_URL_GOERLI = process.env.ALCHEMY_URL_GOERLI;
const ALCHEMY_URL_MUMBAI = process.env.ALCHEMY_URL_MUMBAI;
const RPC_URL_ALFALJORES = process.env.RPC_URL_ALFALJORES;
const PRIVATE_KEY = process.env.PRIVATE_KEY;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: ALCHEMY_URL_GOERLI,
      chainId: 5,
      accounts: [PRIVATE_KEY]
    },
    mumbai: {
      url: ALCHEMY_URL_MUMBAI,
      chainId: 80001,
      accounts: [PRIVATE_KEY]
    },
    alfajores: {
      url: RPC_URL_ALFALJORES,
      chainId: 44787,
      accounts: [PRIVATE_KEY]
    },
  }
};
