require("dotenv").config();
const { 
    ATLAS_DB_PASSWORD,
    ATLAS_DB_USER,
} = process.env;

const { MongoClient } = require('mongodb');

// connection string
const uri = `mongodb+srv://${ATLAS_DB_USER}:${ATLAS_DB_PASSWORD}@cluster0.ww0nqt8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const cooldownDuration = 24 * 60 * 60 * 1000;  // 24 hrs in ms

async function mainDBFunction(userId, testnetName, testToken) {
    try{
        // connect to database
        await client.connect();
        console.log("Connected to database");

        // returns an object: {user: obj, userExists: bool}
        const userInfo = await findUser(client, userId, testnetName, testToken);
        console.log("user exists: ", userInfo);

        // create a new user in db if it's not there
        if(!userInfo.userExists){
            await createListing(client, userId, testnetName, testToken);
            return 1;
        } else {
            // get the timestamp if the user with the given network and token already exists 
            const lastWithdrawalTimestamp = userInfo.result.lastWithdrawTimestamp;

            // update listing if cooldown is complete
            if(Date.now() - lastWithdrawalTimestamp > cooldownDuration){
                await updateListing(client, userId, testnetName, testToken);
                return 2;
            } else {
                // get time-left if cooldown in not complete
                const timeLeft = cooldownDuration - (Date.now() - lastWithdrawalTimestamp);

                const hours = Math.floor(timeLeft / (60*60*1000));
                const minutes = Math.floor((timeLeft % (60*60*60)) / (60*1000));

                // get time left in (hh:mm) format
                const timeLeftInHours = `${hours.toLocaleString(undefined, {minimumIntegerDigits: 2})}:${minutes.toLocaleString(undefined, {minimumIntegerDigits: 2})}`

                const num = 3

                return {timeLeftInHours,num};
            }
        }

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

// find the user with the given parameters
/// @dev returns an obj with two properties:- {user: {} and user: bool}
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

// update listing 
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

// mainDBFunction().catch(console.error);
module.exports = {mainDBFunction}