// This loads the environment variables from the .env file
require('dotenv').config();

// Initialize Bot Middleware
const { botbuilder } = require('../middleware/setChannelContext');

const restify = require('restify');
const builder = require('botbuilder');
const azure = require('botbuilder-azure');
const { botName, dialogs: { login, help, orders } } = require('./utils/constants');
const dialog = require('./dialogs/dialogStore')

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

// Create your bot with a function to receive messages from the user
// Initialize conversation from rootDialogs
const bot = new builder.UniversalBot(connector, dialog.hello.rootDialogs)
  .use({ botbuilder })
  .set('storage', cosmosStorage);

// Setup LUIS and Bing spell check
const luisAppId = process.env.LUIS_APP_ID;
const luisAPIKey = process.env.LUIS_API_KEY;
const bingSpellcheck = process.env.BING_SPELL_CHECK;
const spellCheck = process.env.SPELLCHECK;
const luisAPIHostName = process.env.LUIS_API_HOST_NAME;
const luisModelUrl = `https://${luisAPIHostName}/luis/v2.0/apps/` +
  `${luisAppId}?subscription-key=${luisAPIKey}&spellCheck=${spellCheck}` +
  `&bing-spell-check-subscription-key=${bingSpellcheck}&verbose=true`;

// Main dialog with LUIS - create a recognizer that gets intents from LUIS
const recognizer = new builder.LuisRecognizer(luisModelUrl);

// Add the recognizer to the bot
bot.recognizer(recognizer);

bot.dialog(orders.id, dialog.order).triggerAction({ matches: orders.intent });
bot.dialog(login.id, dialog.login);
bot.dialog(help.id, dialog.help).triggerAction({ matches: help.intent });

// log any bot errors into the console
bot.on('error', (e) => {
  console.error('An error occurred', e);
});
