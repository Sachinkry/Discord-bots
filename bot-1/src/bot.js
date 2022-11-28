require("dotenv").config();

// bot commands and sub-commands
const commands = require("./commands.json");

const { token, CLIENT_ID, GUILD_ID} = process.env;
const { Client, GatewayIntentBits, Routes, EmbedBuilder} = require('discord.js');
const { REST }  = require('@discordjs/rest')

// import some functions from sendTokens.js
const {sendTokens, getFaucetBalance} = require('./sendTokens.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


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
client.on('ready', () => console.log(`${client.user.username} has logged in!,`));

client.on('interactionCreate', async interaction => {
  // get network name from the command given by user
  const testnetName = interaction.options.getSubcommandGroup();
  // get test token name from the command given by user
  const testToken = interaction.options.getSubcommand();

  console.log(interaction.member.user.username);    // username of the user who sent the command

  if (interaction.isChatInputCommand()) {
    // reply to the command
    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Sending ${testToken.toUpperCase()} test tokens. Wait...`)
        ]
      })

      const faucetBalance = await getFaucetBalance(testnetName, testToken);
      console.log("faucetBal: ", faucetBalance);
      // wait for transaction to be mined and return the transaction hash
      const txnInfo = await sendTokens(testnetName, testToken );
      console.log(txnInfo)

      // edit reply with transaction hash and other info
      await interaction.editReply({
          embeds: [new EmbedBuilder()
            .setColor("Blue")
            .setThumbnail("https://gateway.pinata.cloud/ipfs/QmPuCLXQa8XPkYprXgAY26e4ou3fdXMcshZUJ3zGDuRoqD")
            .setTitle(`${txnInfo.network.charAt(0).toUpperCase() + txnInfo.network.slice(1)} Testnet Token Transfer Successful`)
            .setURL(`${txnInfo.blockExplorer}${txnInfo.txnHash}`)    // block explorer url of the transaction
            .addFields(
              {name: "VALUE", value: txnInfo.tokenName, inline: true},
              {name: "TO", value: `Address: ${txnInfo.receiverAddress.slice(0,6)}...${txnInfo.receiverAddress.slice(35,44)}`, inline: true},
              )
            .setTimestamp()
            ]
          })
      }
  }
);
