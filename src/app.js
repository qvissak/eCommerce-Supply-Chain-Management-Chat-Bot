// This loads the environment variables from the .env file
require('dotenv').config();

// Initialize Bot Middleware
const { botbuilder } = require('../middleware/setChannelContext');

const restify = require('restify');
const builder = require('botbuilder');
const azure = require('botbuilder-azure');
const { dialogs } = require('./utils/constants');
const dialog = require('./dialogs/dialogStore');

const logger = require('./utils/logger');

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

// Create bot with a function to receive messages from the user
// Initialize conversation from hello.rootDialogs
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

logger.info('Luis config', {
  luisAppId,
  luisAPIKey,
  luisAPIHostName,
  luisModelUrl,
});

// Main dialog with LUIS - create a recognizer that gets intents from LUIS
const recognizers = [new builder.LuisRecognizer(luisModelUrl)];

// Configure custom threshold for intent recognization
const commonIntentDialog = new builder.IntentDialog({
  recognizeMode: builder.RecognizeMode.onBegin,
  recognizers,
  intentThreshold: 0.6,
});

// Add recognizer to bot
bot.recognizer(commonIntentDialog);

bot.dialog(dialogs.login.id, dialog.login);
bot.dialog(dialogs.logout.id, dialog.logout).triggerAction({ matches: dialogs.logout.intent });
bot.dialog(dialogs.updateOrderStatus.id, dialog.updateOrderStatus)
  .triggerAction({ matches: dialogs.updateOrderStatus.intent });
bot.dialog(dialogs.orders.id, dialog.order).triggerAction({ matches: dialogs.orders.intent });
bot.dialog(dialogs.getOrderStatus.id, dialog.getOrderStatus)
  .triggerAction({ matches: dialogs.getOrderStatus.intent });
bot.dialog(dialogs.help.id, dialog.help).triggerAction({ matches: dialogs.help.intent });
bot.dialog(dialogs.showResults.id, dialog.showResults);
bot.dialog(dialogs.insultDialog.id, dialog.insultDialog).triggerAction({ matches: dialogs.insultDialog.intent });
bot.dialog(dialogs.niceDialog.id, dialog.niceDialog).triggerAction({ matches: dialogs.niceDialog.intent });

// log any bot errors
bot.on('error', (e) => {
  logger.error('An error occurred', e);
});
