 const CONTRACT_ADDRESS_GOERLI = "0x1bCfaB3f5c907Abe8d5Faa299C59dDba7FF51774";
 const CONTRACT_ADDRESS_MUMBAI = "0xfb0dfd71DfF274c6De044412796E6201BE41080E";
 const CONTRACT_ADDRESS_ALFAJORES = "0xe4364C6723513B77f1b17AA05C4a218838A282E0"
 const abi = [
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "transfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];