require("dotenv").config();

const abi = require("./abis/abi.json");
const {PRIVATE_KEY} = process.env;
const {ethers, Wallet, Contract } = require('ethers');
const testnets = require("./testnets");

function getReceiverAddress(){
  // const receiverAddress = "0xf90Ab46798cd69CD5D08addaf803FFAcF4EC7336"
  return "0xA7095A26741B862d71f590914e0F67478BE2Abf5";
}

// filter the testnet with the given name  and token
const getNetworkInfo = (testnetName, testToken) => {
  const network = testnets
          .filter(testnet => testnet.name == testnetName)
          .filter(tesnet => tesnet.token == testToken)
  // since network is an array with one object, and this would return an object
  return network[0];
}


// function to send native tokens to the receiver addresss
const sendTokens = async (testnetName, testToken) => {
  try {
    const testnetObj = getNetworkInfo(testnetName, testToken);
    const receiverAddress = getReceiverAddress();
    const amount = ethers.utils.parseEther(testnetObj.value).toString();
    console.log(testnetObj);

    const provider = new ethers.providers.JsonRpcProvider(testnetObj.endpointUrl);
    const wallet = new Wallet(PRIVATE_KEY, provider);
    
    const contract = new Contract(testnetObj.contractAddress, abi, wallet);
    const tx = await contract.transfer(receiverAddress, amount);
    await tx.wait();

    console.log("transaction successful!");
    const txnHash = tx.hash;
    const network = testnetObj.name;
    const blockExplorer = testnetObj.blockExplorer;
    const tokenName = `${testnetObj.value} ${(testnetObj.token).toUpperCase()}`;

    return {txnHash, network, blockExplorer, tokenName,receiverAddress};

  } catch (error) {
    console.error(error);
    return error
  }
}

const getFaucetBalance = async (testnetName, testToken) => {
  try {
    const testnetObj = getNetworkInfo(testnetName, testToken);

    const provider = new ethers.providers.JsonRpcProvider(testnetObj.endpointUrl);
    const faucetBal = await provider.getBalance(testnetObj.contractAddress);

    console.log("Faucet Balance: ", ethers.utils.formatEther(faucetBal));
    return ethers.utils.formatEther(faucetBal);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {sendTokens, getFaucetBalance};