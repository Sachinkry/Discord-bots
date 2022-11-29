require("dotenv").config();
const { 
    ATLAS_DB_PASSWORD,
    ATLAS_DB_USER,
} = process.env;

const { time } = require("discord.js");
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${ATLAS_DB_USER}:${ATLAS_DB_PASSWORD}@cluster0.ww0nqt8.mongodb.net/?retryWrites=true&w=majority`;
const cooldownDuration = 24 * 60 * 60 * 1000;  // 24 hrs in ms

const sortListingBy = {discordUserId: 1, network: 1, token: 1}

const client = new MongoClient(uri);
async function mainDBFunction(userId, testnetName, testToken) {
    try{
        await client.connect();
        console.log("Connected to database");

        const userInfo = await findUser(client, userId, testnetName, testToken);
        console.log("user exists: ", userInfo);

        if(!userInfo.userExists){
            await createListing(client, userId, testnetName, testToken);
            return 1;
        } else {
            const lastWithdrawalTimestamp = userInfo.result.lastWithdrawTimestamp;

            if(Date.now() - lastWithdrawalTimestamp > cooldownDuration){
                await updateListing(client, userId, testnetName, testToken);
                return 2;
            } else {
                const timeLeft = cooldownDuration - (Date.now() - lastWithdrawalTimestamp);

                const hours = Math.floor(timeLeft / (60*60*1000));
                const minutes = Math.floor((timeLeft % (60*60*60)) / (60*1000));

                // const timeLeftInHours = `${Math.floor(timeLeft / (60*60*1000))}: ${Math.floor((timeLeft % (60*60*60)) / (60*1000))}`;
                const timeLeftInHours = `${hours.toLocaleString(undefined, {minimumIntegerDigits: 2})}:${minutes.toLocaleString(undefined, {minimumIntegerDigits: 2})}`

                // console.log(`time left: ${hours.toLocaleString(undefined, {minimumIntegerDigits: 2})}:${minutes.toLocaleString(undefined, {minimumIntegerDigits: 2})}`);
                const num = 3

                return {timeLeftInHours,num};
            }
        }

        // await findTheUser(client, '723023436552601673');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

} 

// mainDBFunction().catch(console.error);

async function createListing(client, userId, testnetName, testToken){
    try {

        const result =  await client.db("faucet-bot").collection("faucetUsers").insertOne({
            discordUserId: userId, 
            network: testnetName, 
            token: testToken, 
            lastWithdrawTimestamp: Date.now(),
        });
        
        console.log(`New listing created with the following id: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
    }
}

async function findUser(client, userId, testnetName, testToken){   
    try {
        const result = await client.db("faucet-bot").collection("faucetUsers").findOne({discordUserId: userId, network: testnetName, token: testToken});
    
        console.log("user: ", result );
        const userExists = result ? true:false;
        return {result, userExists}
    } catch(err) {
        console.error(err);
    }
}

async function updateListing(client, userId, testnetName, testToken){
    try {
        const result = await client.db("faucet-bot").collection("faucetUsers").updateOne({
            discordUserId: userId, 
            network: testnetName, 
            token: testToken,
        }, 
        {$set: {lastWithdrawTimestamp: Date.now()}});
        
        console.log("updated User: ", result)
    } catch (err) {
        console.error(err);
    }
}

async function findTheUser(client, discordUserIdVal) {
        const result = await client.db("faucet-bot").collection("faucetUsers").findOne({discordUserId: discordUserIdVal});
        console.log("user: ", result);
    
}

// mainDBFunction().catch(console.error);
module.exports = {mainDBFunction}