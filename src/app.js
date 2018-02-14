// This loads the environment variables from the .env file
require('dotenv').config();

const restify = require('restify');
const builder = require('botbuilder');
const azure = require('botbuilder-azure');
const { dialogNames, dialogLabels, botName } = require('./utils/constants');

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
      session.beginDialog(dialogNames.login);
    }
    next();
  },
  (session) => {
    builder.Prompts.choice(
      session,
      'How can I help you today?',
      [dialogLabels.Orders, dialogLabels.Help],
      {
        maxRetries: 3,
        retryPrompt: 'Not a valid option',
      },
    );
  },
  (session, result) => {
    if (!result.response) {
      // exhausted attempts and no selection, start over
      session.send("Oops! Too many attempts. But don't worry, you can try again!");
      return session.endDialog();
    }

    // continue on proper dialog
    const selection = result.response.entity;
    switch (selection) {
      case dialogLabels.Orders:
        return session.beginDialog(dialogNames.orders);
      case dialogLabels.Help:
      default:
        return session.beginDialog(dialogNames.help);
    }
  },
];

const bot = new builder.UniversalBot(connector, rootDialogs)
  .set('storage', cosmosStorage);

bot.dialog(dialogNames.orders, require('./dialogs/orders'));
bot.dialog(dialogNames.login, require('./dialogs/login'));
bot.dialog(dialogNames.help, require('./dialogs/help'))
  .triggerAction({
    matches: [/help/i, /support/i, /problem/i],
    onSelectAction: (session, args) => {
      // Add the help dialog to the top of the dialog stack
      // (override the default behavior of replacing the stack)
      session.beginDialog(args.action, args);
    },
  });

// log any bot errors into the console
bot.on('error', (e) => {
  console.error('An error occurred', e);
});
