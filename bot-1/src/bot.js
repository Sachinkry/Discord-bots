require("dotenv").config();
const { 
  token, 
  CLIENT_ID,  
  GUILD_ID
} = process.env;

const { Client, Collection, GatewayIntentBits, Routes } = require('discord.js');
const { REST }  = require('@discordjs/rest')

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
  if (interaction.isChatInputCommand()) {
    const network = interaction.options.getSubcommandGroup();
    const testToken = interaction.options.getSubcommand();
    console.log(network, testToken);
    
    interaction.reply({ content: `${testToken == 'eth' ? '1': ''} ${testToken == 'eth' ? 'ETH token' : 'LINK tokens'} transferred` });

    sendTokens();
  }
});
function sendTokens() {
  console.log('transferred!');
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