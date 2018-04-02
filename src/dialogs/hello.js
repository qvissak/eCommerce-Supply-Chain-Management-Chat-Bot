const { botName, dialogs: { login } } = require('../utils/constants');
const apiStore = require('../apis/apiStore');
const config = require('../config');

const rootDialogs = [
  (session, args, next) => {
    if (!session.conversationData.didGreet) {
      // session.conversationData is volatile, it will be cleared at the end of the
      // conversation hence, the bot will say hello at the start of every conversation
      session.send(`Hello, I'm ${botName}.`);
      session.conversationData.didGreet = true;
      // at the start of the conversation, load the API key from userData
      // and store the key in config if the key is valid
      config.setKey(session.userData.apiKey);
    }
    next();
  },
  (session, args, next) => {
    // config.setKey('9C39DFA4-E061-4B3E-9504-CBDB4EDB070D');
    apiStore.auth.validateAPIkey(session.conversationData.apiKey, (isValid) => {
      session.userData.validKey = isValid;
    });

    if (!session.userData.validKey) {
      session.beginDialog(login.id);
    }
    next();
  },
  (session) => {
    session.send('How can I help you today?');
  },
];

module.exports = {
  rootDialogs,
};
