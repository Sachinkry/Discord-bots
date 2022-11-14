require("dotenv").config();
const { 
  token, 
  CLIENT_ID,  
  GUILD_ID,
  PRIVATE_KEY,
} = process.env;

const { 
  Client,
  GatewayIntentBits, 
  Routes,
  EmbedBuilder,
  
} = require('discord.js');
const { REST }  = require('@discordjs/rest')

const { ethers, Wallet } = require('ethers');
const {abi, CONTRACT_ADDRESS_GOERLI, } = require("../constants/index")

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
  const commands = [
    {
      "name": "faucet",
      "description": "Get or edit permissions for a user or a role",
      "options": [
          {
              "name": "goerli",
              "description": "goerli tesnet tokens",
              "type": 2, // 2 is type SUB_COMMAND_GROUP
              "options": [
                  {
                      "name": "eth",
                      "description": "Get 1 ETH goerli tesnet tokens",
                      "type": 1 // 1 is type SUB_COMMAND
                  },
                  {
                      "name": "link",
                      "description": "Get goerli LINK tokens",
                      "type": 1
                  }
              ]
          },
          {
              "name": "mumbai",
              "description": "mumbai testnet tokens",
              "type": 2,
              "options": [
                  {
                      "name": "matic",
                      "description": "Get 1 MATIC mumbai testnet tokens",
                      "type": 1
                  },
                  {
                      "name": "link",
                      "description": "Get mumbai LINK tokens",
                      "type": 1
                  }
              ]
          },
          {
            "name": "alfajores",
            "description": "celo testnet token",
            "type": 2, // 2 is type SUB_COMMAND_GROUP
            "options": [
                {
                    "name": "celo",
                    "description": "Get 1 CELO tesnet tokens",
                    "type": 1 // 1 is type SUB_COMMAND
                }
            ]
        }
      ]
  }
    
  ];
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
  const network = interaction.options.getSubcommandGroup();
  const networkName = network.charAt(0).toUpperCase() + network.slice(1);
  const testToken = interaction.options.getSubcommand();
  let message = `${testToken == 'link' ? '': 1} ${testToken.toUpperCase()} ${testToken == 'link' ? '(chainlink)' : ''} test tokens transferred to address 0x `
  if (interaction.isChatInputCommand()) {
    interaction.reply({ 
      embeds: [new EmbedBuilder()
        .setDescription(message)
        .setColor('Aqua')
        .setURL("https://goerli.etherscan.io/address/0xf36f155486299ecaff2d4f5160ed5114c1f66000")
        .setTitle(`${networkName} Testnet Token Transfer `)

      ]
    });

    sendTokens();
  }
});

// console.log("Wallet addr: ", wallet.address, wallet);
const ALCHEMY_URL_GOERLI="yxUVee2fP410o7NSE5lwugJ5G0uBzw0X"
const testNetwork = {
  chainId: 5,
  name: "goerli",
};



async function sendTokens() {
  try{

    const provider = new ethers.providers.AlchemyProvider({
      5,
      
    })
    console.log("Provider: ", provider)
    let wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS_GOERLI, abi, wallet );

    console.log("CI: ",contractInstance);
    const tx = await contractInstance.getBalance();
    console.log(tx);
  } catch (error) {
    console.error(error);
  }
}



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