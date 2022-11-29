## LW-3 Faucet Bot: 
The Faucet Bot makes sending funds easier than ever before. All you have to do is type the command `/faucet` followed by the `<network>`  and the `<token>` you wish to receive.

On selecting/typing one of the commands:-
`/faucet goerli eth`
`/faucet goerli link`
`/faucet mumbai matic`
`/faucet mumbai link`   
`/faucet alfajores celo`,
the bot sends funds.

### Getting Started:
1. Run ```git clone https://github.com/Sachinkry/Discord-bots.git```
2. Create a `.env` file in the root of `bot-1` directory
3. Enter these values in the `.env` file 
```
TOKEN=<BOT_TOKEN>               // from discord developer portal
CLIENT_ID=<BOT_CLIENT_ID>      // from discord developer portal
GUILD_ID=<SERVER_ID>   
PRIVATE_KEY=<PRIVATE_KEY>
ATLAS_DB_USER=<ATLAS_CLUSTER_NAME>      
ATLAS_DB_PASSWORD=<ATLAS_USER_PASSWORD>  // from the database user section
```
4. Run `npm run devStart` in `bot-1` directory to install the necessary dependencies

### Video:
https://user-images.githubusercontent.com/97998435/204553777-5b3d510c-b721-4e61-a9f9-082bd95f9ce7.mp4


### Some important files
1. `bot.js` : contains the command and reply logic. And calling database or send token functions
2. `database.js`: connecting with database and creating or updating user's database.
3. `sendTokens.js`: creating contract instances and sending transactions to testnets
4. `testnets.js`: an array of objects containing tesnet info
5. `commands.json`: contains all the commands and sub-commands
