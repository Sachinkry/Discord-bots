
const tesnets = [

        {
            name: "goerli", 
            token: "eth",
            endpointUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            contractAddress: "0xc44E15cbbe614DC2bf904ad804d26E57e6061486",
            value: "0.01",
            blockExplorer: "https://goerli.etherscan.io/tx/",
        },
        {
            name: "goerli", 
            token: "link",
            endpointUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            contractAddress:"0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
            value: "1",
            blockExplorer: "https://goerli.etherscan.io/tx/",
        },
        {
            name: "mumbai", 
            token: "matic",
            endpointUrl: "https://polygon-mumbai.g.alchemy.com/v2/ivcJQdjhx-71mh0dCV1ILW3yMdG4ojCB",
            contractAddress: "0xf34Fb0e0Bd48863A505257c9c3ec0365a5c91B76",
            value: "0.01",
            blockExplorer: "https://mumbai.polygonscan.com/tx/"
        },
        {
            name: "mumbai", 
            token: "link",
            endpointUrl: "https://polygon-mumbai.g.alchemy.com/v2/ivcJQdjhx-71mh0dCV1ILW3yMdG4ojCB",
            contractAddress:"0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
            value: "1",
            blockExplorer: "https://mumbai.polygonscan.com/tx/"
        },
        {
            name: "alfajores", 
            token: "celo",
            endpointUrl: "https://celo-alfajores.infura.io/v3/db4a3fd4a7ee4db1969bb3025b88aa20",
            contractAddress: "0x4822827b018CbEa7d8A4A92Bc71678aD5fd63bd2",
            value: "0.01",
            blockExplorer: "https://explorer.celo.org/alfajores/tx/"
        }
]

module.exports = tesnets;


