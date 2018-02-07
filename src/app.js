// This loads the environment variables from the .env file
require('dotenv').config();

const restify = require('restify');
const builder = require('botbuilder');
const azure = require('botbuilder-azure');
const authentication = require('./dialogs/authentication');
const dialogHelp = require('./dialogs/help');

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

const DialogLabels = {
  Login: 'Login',
  Help: 'Help',
  Demo: 'Demo'
};

const rootDialogs = [
  (session) => {
    builder.Prompts.choice(
      session,
      'Do you want to login to Logicbroker or would you like help?',
      [DialogLabels.Login, DialogLabels.Help, DialogLabels.Demo],
      {
        maxRetries: 3,
        retryPrompt: 'Not a valid option',
      }
	);
  },
  (session, result) => {
    if (!result.response) {
      // exhausted attemps and no selection, start over
      session.send('Oops! Too many attemps. But don\'t worry, I\'m handling that exception and you can try again!');
      return session.endDialog();
    }

    // on error, start over
    session.on('error', (err) => {
      session.send(`Failed with message: ${err.message}`);
      session.endDialog();
    });

    // continue on proper dialog
    const selection = result.response.entity;
    switch (selection) {
      case DialogLabels.Login:
        return session.beginDialog('login');
      case DialogLabels.Help:
        return session.beginDialog('help');
	case DialogLabels.Demo:
		return session.beginDialog('demo');
    }
  },
];

const bot = new builder.UniversalBot(connector, rootDialogs)
  .set('storage', cosmosStorage);

function shouldRespond(session) {
  if (process.env.BOT_TESTING === 'True') { return true; }
  if (session.message.address.channelId === 'slack') {
    const { isGroup } = session.message.address.conversation;
    return !isGroup || (isGroup && session.message.text.includes(process.env.SLACK_HANDLE));
  }
  return false;
}

bot.dialog('login', require('./dialogs/authentication'));
bot.dialog('demo', require('./dialogs/demo'));
bot.dialog('help', require('./dialogs/help'))
	.triggerAction({
	    matches: [/help/i, /support/i, /problem/i],
	    onSelectAction: (session, args, next) => {
	        // Add the help dialog to the top of the dialog stack 
	        // (override the default behavior of replacing the stack)
			console.log('beginning dialog... args.action  = ', args.action);
	        session.beginDialog(args.action, args);
	    }
	});

// log any bot errors into the console
bot.on('error', (e) => {
  console.error('And error ocurred', e);
});
