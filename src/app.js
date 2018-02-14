// This loads the environment variables from the .env file
require('dotenv').config();

const restify = require('restify');
const builder = require('botbuilder');
const azure = require('botbuilder-azure');
const { botName, dialogs: { login, help, orders } } = require('./utils/constants');

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

const rootDialogs = [
  (session, args, next) => {
    if (!session.conversationData.didGreet) {
      // session.userData is volatile, it will be cleared at the end of the conversation
      // hence, the bot will say hello at the start of every conversation
      session.send(`Hello, I'm ${botName}.`);
      session.conversationData.didGreet = true;
    }
    next();
  },
  (session, args, next) => {
    if (!session.userData.apiKey) {
      session.beginDialog(login.id);
    }
    next();
  },
  (session) => {
    session.send('How can I help you today?');
  },
];

// Create your bot with a function to receive messages from the user
const bot = new builder.UniversalBot(connector, rootDialogs)
  .set('storage', cosmosStorage);

// Setup LUIS
const luisAppId = process.env.LuisAppId;
const luisAPIKey = process.env.LuisAPIKey;
const luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
const LuisModelUrl = `https://${luisAPIHostName}/luis/v2.0/apps/${luisAppId}?subscription-key=${luisAPIKey}`;

// Main dialog with LUIS - create a recognizer that gets intents from LUIS
const recognizer = new builder.LuisRecognizer(LuisModelUrl);
// Add the recognizer to the bot
bot.recognizer(recognizer);

bot.dialog(orders.id, require('./dialogs/orders')).triggerAction({ matches: orders.pattern });
bot.dialog(login.id, require('./dialogs/login'));
bot.dialog(help.id, require('./dialogs/help')).triggerAction({ matches: help.pattern });

// log any bot errors into the console
bot.on('error', (e) => {
  console.error('An error occurred', e);
});
