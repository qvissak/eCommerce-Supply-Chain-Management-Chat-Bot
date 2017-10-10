const builder = require('botbuilder');

// Create chat bot
const connector = new builder.ConsoleConnector(
/*
    {
        appId:
        appPassword:
    }
*/
).listen();
const bot = new builder.UniversalBot(connector, function (session) {
  // Bot dialog
  session.send("You said: %s", session.message.text);
});
