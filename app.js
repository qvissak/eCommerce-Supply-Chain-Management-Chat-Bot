var builder = require('botbuilder');

// Create chat bot
var connector = new builder.ConsoleConnector(
/*
    {
        appId:
        appPassword:
    }
*/
).listen();
var bot = new builder.UniversalBot(connector, function (session) {
    // Bot dialog
    session.send("You said: %s", session.message.text);
});