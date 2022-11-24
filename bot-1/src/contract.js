require("dotenv").config();
const abi = require("./abi/abi.json");
const {PRIVATE_KEY, CONTRACT_ADDRESS_GOERLI } = process.env;
const { ethers, Wallet, Contract, utils } = require('ethers');
// console.log("abi: ",abi);

const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

const sendTokens = async () => {
    try{
      const wallet = new Wallet(PRIVATE_KEY, provider)
    //   console.log("addr: ", CONTRACT_ADDRESS_GOERLI);
      const contract = new Contract(CONTRACT_ADDRESS_GOERLI, abi, wallet);
    //   console.log("contract: ", contract);
      const amount = ethers.utils.parseEther("0.01").toString();
      console.log(amount);
      const tx = await contract.transfer("0xf90Ab46798cd69CD5D08addaf803FFAcF4EC7336", amount);
      await tx.wait();
      console.log("tx: ", tx);
      console.log("sent tokens");
      
    } catch (error) {
      console.error(error);
    }
  }

//   sendTokens();

