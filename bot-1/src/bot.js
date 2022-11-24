require("dotenv").config();
const commands = require("./commands.json");

const { token, CLIENT_ID, GUILD_ID} = process.env;
const { Client, GatewayIntentBits, Routes, EmbedBuilder,} = require('discord.js');
const { REST }  = require('@discordjs/rest')

// contract related
const abi = require("./abi/abi.json");
const {PRIVATE_KEY, CONTRACT_ADDRESS_GOERLI, CONTRACT_ADDRESS_MUMBAI, CONTRACT_ADDRESS_ALFAJORES } = process.env;
const {ethers, Wallet, Contract } = require('ethers');
const networks = require("./networks.json");

let providerURL="";
let contractAddress="";
let network="";
let testToken="";
const nativeTokenValue = "0.01"


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
  const networkName = network.charAt(0).toUpperCase() + network.slice(1);
  testToken = interaction.options.getSubcommand();
  let message = `${testToken == 'link' ? '': nativeTokenValue} ${testToken.toUpperCase()} ${testToken == 'link' ? '(chainlink)' : ''} test tokens transferred to address ${getReceiverAddress} `
  sendTokens();
  if (interaction.isChatInputCommand()) {
    interaction.reply({ 
      embeds: [new EmbedBuilder()
        // .setDescription(message)
        .setColor('Aqua')
        .setThumbnail('https://learnweb3.io/brand/logo-blue.png')
        .setURL("https://goerli.etherscan.io/address/0xf36f155486299ecaff2d4f5160ed5114c1f66000")
        .setTitle(`${networkName} Testnet Token Transfer `)
        .setFields(
          {name: 'Value:', value: nativeTokenValue},
          {name: "From", value: contractAddress, inline: true},
          {name: "To", value: getReceiverAddress(), inline: true}
        )
        

      ]
    });
    // sendTokens();
  }
  
});

// sendFunds


function getReceiverAddress(){
  const receiverAddress = "0xf90Ab46798cd69CD5D08addaf803FFAcF4EC7336"
  return receiverAddress;;
}
const getNetworkUrl = async () => {
  try {
    if(network == "goerli"){
      providerURL = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
      contractAddress = CONTRACT_ADDRESS_GOERLI;
    } else if(network == "mumbai"){
      providerURL = "https://rpc-mumbai.matic.today";
      contractAddress = CONTRACT_ADDRESS_MUMBAI;
    } else if(network == "alfajores"){
      providerURL = "https://celo-alfajores-rpc.allthatnode.com";
      contractAddress = CONTRACT_ADDRESS_ALFAJORES;
    }
    return {providerURL, contractAddress};
  } catch (err) {
    console.error(err);
  }
}

const sendTokens = async () => {
  try {
    await getNetworkUrl();
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    console.log("providerURL", providerURL);
    const wallet = new Wallet(PRIVATE_KEY, provider)
    console.log("address", contractAddress);
    const contract = new Contract(contractAddress, abi, wallet);
    //   console.log("contract: ", contract);
      // const amount = ethers.utils.parseEther(nativeTokenValue).toString();
      // console.log(amount);
      // const tx = await contract.transfer("0xf90Ab46798cd69CD5D08addaf803FFAcF4EC7336", amount);
      // await tx.wait();
      // console.log("tx: ", tx);
      // console.log("sent tokens");

  } catch (error) {
    console.error(error);
  }
}
// sendTokens();

// client.on('messageCreate', msg => {
//   if (msg.content == 'hello bot') {
//     msg.reply('hi genius! how are you?')
//   }
//   console.log(msg.author);
//   console.log(msg.createdAt.toDateString());
//   console.log(`${msg.author.username} just messaged "${msg.content}"`);

// });

// client.on('channelCreate', (channel) => {
//   console.log(`'${channel.name}' channel created!`)
// })