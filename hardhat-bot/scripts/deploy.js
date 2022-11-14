const { ethers } = require('hardhat');

async function main() {
  const faucetFactory = await ethers.getContractFactory("Faucet");

  const amount = ethers.utils.parseEther("0.5");

  const faucetContract = await faucetFactory.deploy({value: amount});
  await faucetContract.deployed();

  console.log("Contract address: ", faucetContract.address);
}

 
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });