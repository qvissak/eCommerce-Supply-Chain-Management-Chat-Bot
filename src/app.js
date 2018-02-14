// This loads the environment variables from the .env file
require('dotenv').config();

const restify = require('restify');
const builder = require('botbuilder');
const azure = require('botbuilder-azure');
const authentication = require('./dialogs/authentication');
const dialogHelp = require('./dialogs/help');
const dialogOrders = require('./dialogs/orders');

// Setup Azure Cosmos DB database connection
const documentDbOptions = {
  host: process.env.DB_HOST,
  masterKey: process.env.DB_MASTERKEY,
  database: 'botdocs',
  collection: 'botdata',
};

const docDbClient = new azure.DocumentDbClient(documentDbOptions);
const cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD,
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

//Create your bot with a function to receive messages from the user
const bot = new builder.UniversalBot(connector, function (session, args) {
  session.send('You reached the default message handler. You said \'%s\'.', session.message.text);
})
  .set('storage', cosmosStorage);

//LUIS fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

console.log(`AppId: ${luisAppId}`);
console.log(`APIKey: ${luisAPIKey}`);
console.log(`HostName: ${luisAPIHostName}`);

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

console.log(`ModelURL: ${LuisModelUrl}`);

//Main dialog with LUIS
//Create a recognizer that gets intents from LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
//Add the recognizer to the bot
bot.recognizer(recognizer);

function shouldRespond(session) {
  const testing = process.env.BOT_TESTING === 'True';
  if (testing || session.message.address.channelId === 'slack') {
    const { isGroup } = session.message.address.conversation;
    return !isGroup || (isGroup && session.message.text.includes(process.env.SLACK_HANDLE));
  }
  return false;
}

bot.dialog('getOrders', dialogOrders).triggerAction({
    matches: 'GetOrders'
  })

bot.dialog('login', authentication);
bot.dialog('help', dialogHelp)
  .triggerAction({
    //matches: [/help/i, /support/i, /problem/i],
    matches: 'Utilities.Help'
  });
// log any bot errors into the console
bot.on('error', (e) => {
  console.error('And error ocurred', e);
});
