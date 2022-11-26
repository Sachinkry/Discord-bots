require("dotenv").config();
const commands = require("./commands.json");

const { token, CLIENT_ID, GUILD_ID} = process.env;
const { Client, GatewayIntentBits, Routes, EmbedBuilder} = require('discord.js');
const { REST }  = require('@discordjs/rest')

// contract related
const abi = require("./abi/abi.json");
const {PRIVATE_KEY, CONTRACT_ADDRESS_GOERLI, CONTRACT_ADDRESS_MUMBAI, CONTRACT_ADDRESS_ALFAJORES } = process.env;
const {ethers, Wallet, Contract } = require('ethers');
const networks = require("./networks.json");

let providerURL="";
let contractAddress="";
let receiverAddress=getReceiverAddress();
let network="";
let testToken="";
const nativeTokenValue = "0.01"
const linkTokenValue = "20"
let faucetBalance = 0;
let txnHash='';
let blockExplorer='';


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => console.log(`${client.user.username} has logged in!,`));

const rest = new REST({version: '10'}).setToken(token);

async function main() {
  try{
    console.log("Initiating guild commands");
    
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { 
      body: commands,
    });
    client.login(token);
    console.log("Successfully initiated!");
  } catch (error){
    console.error(error);
  }
}

main();


client.on('interactionCreate', async interaction => {
  network = interaction.options.getSubcommandGroup();
  // const networkName = network.charAt(0).toUpperCase() + network.slice(1);
  testToken = interaction.options.getSubcommand();
  let message = `${testToken == 'link' ? linkTokenValue: nativeTokenValue} ${testToken.toUpperCase()} ${testToken == 'link' ? '(chainlink)' : ''} test tokens transferred. `
  let tokenName = `${testToken == 'link' ? linkTokenValue: nativeTokenValue} ${testToken.toUpperCase()}`
  console.log(tokenName);
  // await sendNativeTokens();
  console.log(interaction.member.user.id)
  if (interaction.isChatInputCommand()) {
    await interaction.reply({
      
      embeds: [new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Sending ${testToken.toUpperCase()} test tokens. Wait...`)
        .setThumbnail('https://gateway.pinata.cloud/ipfs/QmPuCLXQa8XPkYprXgAY26e4ou3fdXMcshZUJ3zGDuRoqD')
        .addFields(
          {name: 'VALUE', value: tokenName}
          )
        ]
      })
      txnHash = await sendNativeTokens();
      await interaction.editReply({
        embeds: [new EmbedBuilder()
            .setColor("Blue")
            .setThumbnail("https://gateway.pinata.cloud/ipfs/QmPuCLXQa8XPkYprXgAY26e4ou3fdXMcshZUJ3zGDuRoqD")
            .setTitle(`${network.charAt(0).toUpperCase() + network.slice(1)} Testnet Token Transfer Successful`)
            .setURL(`${blockExplorer}${txnHash}`)
            .addFields(
                {name: "TO", value: `Address: ${contractAddress.slice(0,6)}...${contractAddress.slice(35,44)}`, inline: true},
                {name: "VALUE", value: tokenName, inline: true}
            )
        ]
      })
  }
  
});

// sendFunds


function getReceiverAddress(){
  // receiverAddress = "0xf90Ab46798cd69CD5D08addaf803FFAcF4EC7336"
  return "0xf90Ab46798cd69CD5D08addaf803FFAcF4EC7336";
}
const getNetworkUrl = async () => {
  try {
    if(network == "goerli"){
      providerURL = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
      contractAddress = CONTRACT_ADDRESS_GOERLI;
      blockExplorer = "https://goerli.etherscan.io/tx/"
    } else if(network == "mumbai"){
      providerURL = "https://polygon-mumbai.g.alchemy.com/v2/ivcJQdjhx-71mh0dCV1ILW3yMdG4ojCB";
      contractAddress = CONTRACT_ADDRESS_MUMBAI;
      blockExplorer = "https://mumbai.polygonscan.com/tx/"
    } else if(network == "alfajores"){
      providerURL = "https://celo-alfajores.infura.io/v3/db4a3fd4a7ee4db1969bb3025b88aa20";
      contractAddress = CONTRACT_ADDRESS_ALFAJORES;
      blockExplorer = "https://explorer.celo.org/alfajores/tx/"
    }
    return {providerURL, contractAddress};
  } catch (err) {
    console.error(err);
  }
}

const sendNativeTokens = async () => {
  try {
    await getNetworkUrl();
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    // faucetBalance = await provider.getBalance(contractAddress);

    console.log("providerURL", providerURL);
    const wallet = new Wallet(PRIVATE_KEY, provider)
    console.log("address", contractAddress);
    
    const contract = new Contract(contractAddress, abi, wallet);
    // console.log("contract: ", contract);
    receiverAddress = getReceiverAddress();
    const amount = ethers.utils.parseEther(nativeTokenValue).toString();
    console.log(typeof amount);
    const tx = await contract.transfer(receiverAddress, amount);
    
    await tx.wait();
    console.log("txHash: ", tx.hash);
    console.log("sent tokens to: ", receiverAddress);
    console.log("transaction successful!");
    return tx.hash

  } catch (error) {
    console.error(error);
  }
}


// sendTokens();

// client.on('messageCreate', msg => {
//   if (msg.author.id == CLIENT_ID) {
    
//     msg.reply({
//       embeds: [new EmbedBuilder()
//         .setColor("Blue")
//         .setThumbnail("https://gateway.pinata.cloud/ipfs/QmPuCLXQa8XPkYprXgAY26e4ou3fdXMcshZUJ3zGDuRoqD")
//         .setTitle(`${network.charAt(0).toUpperCase() + network.slice(1)} Testnet Token Transfer Successful.`)
//         .setURL(`${blockExplorer}${txnHash}`)
//         .addFields(
//             {name: "TO", value: `${contractAddress.slice(0,6)}...${contractAddress.slice(35,44)}`, inline: true},
//     //         {name: "TO", value: `${receiverAddress}`, inline: true},
//         )
//       ]
//     })
//   }
  // console.log(msg.author.id);
  // console.log(msg.createdAt.toDateString());
  // console.log(`${msg.author.username} just messaged "${msg.content}"`);

// });

// client.on('channelCreate', (channel) => {
//   console.log(`'${channel.name}' channel created!`)
// })