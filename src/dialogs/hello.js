const { botName, dialogs: { login } } = require('../utils/constants');
const smartResponse = require('./smartResponse');
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
      // and store the key in config
      config.setKey(session.userData.apiKey);
    }
    next();
  },
  (session, args, next) => {
    apiStore.auth.validateAPIkey(session.conversationData.apiKey, (isValid) => {
      session.userData.validKey = isValid;
    });

    if (!session.userData.validKey) {
      session.beginDialog(login.id);
    }
    next();
  },
  (session) => {
    const dialog = smartResponse.helpInquiry();
    session.send(dialog);
  },
];

module.exports = {
  rootDialogs,
};
