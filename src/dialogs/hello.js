const { botName, dialogs: { login } } = require('../utils/constants');

const rootDialogs = [
    (session, args, next) => {
      if (!session.conversationData.didGreet) {
        // session.conversationData is volatile, it will be cleared at the end of the 
        // conversation hence, the bot will say hello at the start of every conversation
        session.send(`Hello, I'm ${botName}.`);
        session.conversationData.didGreet = true;
      }
      next();
    },
    (session, args, next) => {
      if (!session.userData.apiKey) {
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
