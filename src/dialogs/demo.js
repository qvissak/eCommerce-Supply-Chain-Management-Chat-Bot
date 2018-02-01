const builder = require('botbuilder');
const logicbrokerService = require('../utils/logicbroker-service');

module.exports = [
  // API key retrieval
  session => builder.Prompts.text(session, 'Welcome to Logicbroker! We noticed you do not have an API Key setup. Please provide your Logicbroker API Key.'),
  (session, results, next) => {
    session.dialogData.logicbrokerAPIKey = results.response;
    next();
  },
  // API key validation
  (session) => {
    const key = session.dialogData.logicbrokerAPIKey;
    session.send(`We are verifying your key...`);
    session.send(`Thank you, Logicbroker Merchant! We have successfully verified your account.`)

    builder.Prompts.choice(
      session,
      'What would you like to do?',
      ['See latest orders', 'Get open orders', 'See latest shipments']
  );
  },
  (session, results, next) => {
      //Pretend get open orders
      session.send('Order number: 69696969\n\nOrder date: 01/29/2018 03:56 PM');
  }
];
