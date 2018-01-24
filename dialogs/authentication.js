const builder = require('botbuilder');
const logicbrokerService = require('./logicbroker-service');

module.exports = [
  // API key retrieval
  session => builder.Prompts.text(session, 'Please enter your Logicbroker API key'),
  (session, results, next) => {
    session.dialogData.logicbrokerAPIKey = results.response;
    next();
  },
  // API key validation
  (session) => {
    const key = session.dialogData.logicbrokerAPIKey;
    session.send(`Validating your API key, ${key}`);

    // async
    logicbrokerService.validateAPIKey(key)
      .then((response) => {
        session.send('Check the console for the server\'s response to your API key');
        console.log('Logicbroker response:', response);
        // make sure to end dialog in async callback/handler
        session.endDialog();
      });
  },
];
