require("dotenv").config();

// bot commands and sub-commands
const commands = require("./commands.json");

const { token, CLIENT_ID, GUILD_ID} = process.env;
const { Client, GatewayIntentBits, Routes, EmbedBuilder} = require('discord.js');
const { REST }  = require('@discordjs/rest')

// import some functions from sendTokens.js
const {sendTokens, getFaucetBalance} = require('./sendTokens.js');
const { mainDBFunction } = require('./database.js');

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

  const userId = interaction.member.user.id;    // Id of the user who sent the command

  // 1. check if there's a user with the given id, network and token
  // 2. if no, create a new user with the given id, network and token in the database
  // 3. if yes, check if the user has withdrawn this token in the last 24 hours
  // 4. if yes , send a message to the user that they have already withdrawn this token in the last 24 hours
  // 5. if no, send the tokens to the user and update the last withdrawal time in the database
  // 6. send a message to the user that the tokens have been sent to their address
  // const lastWithdrawalTime = await getLastWithdrawal(userId,testnetName, testToken)

  
  if (interaction.isChatInputCommand()) {
    // reply to the command
    await interaction.reply({
  
      embeds: [new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Sending ${testToken.toUpperCase()} test tokens. Wait...`)
        ]
      })

      // get faucet balance
      const faucetBalance = await getFaucetBalance(testnetName, testToken);
      console.log("faucetBal: ", faucetBalance);
      
      // connect with database and add user if not added already
      // returns 1 or 2 or {timeLeft, num: 3}
      const createOrUpdateUser = await mainDBFunction(userId, testnetName, testToken);
      console.log("creadfdf: ", createOrUpdateUser);

      if(createOrUpdateUser === 1 || createOrUpdateUser === 2){
        const txnInfo = await sendTokens(testnetName, testToken );
        console.log(txnInfo);
        // edit reply with transaction hash and other info
        // this would be sent to discord-user if a transactin is mined and funds are transferred
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

      } else if (createOrUpdateUser.num === 3){
        // this would be sent to user if cooldown is still there for a given user, network and token
        await interaction.editReply({
           
          embeds: [new EmbedBuilder()
            .setColor("DarkGold")
            .setTitle(`The funds are available once every 24 hours.`)
            .setThumbnail("https://gateway.pinata.cloud/ipfs/QmPuCLXQa8XPkYprXgAY26e4ou3fdXMcshZUJ3zGDuRoqD")
            .addFields(
              {name: "NEXT WITHDRAWAL", value: `In ${createOrUpdateUser.timeLeftInHours} hours`, inline: true},
            )
          ]
        })
      }

      }
  }
);
