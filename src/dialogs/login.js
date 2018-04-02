const builder = require('botbuilder');
const { dialogs } = require('../utils/constants');
const config = require('../config');
const apiStore = require('../apis/apiStore');

module.exports = [
  (session, args) => {
    const text = args && args.reprompt
      ? 'Your API key is invalid. Please try again.'
      : 'Please enter your Logicbroker API key.';
    builder.Prompts.text(session, text);
  },
  (session, results) => {
    const key = results.response;
    session.userData.apiKey = key;
    // API key validation (async)
    session.send(`Validating your API key, ${key}.`);
    apiStore.auth.validateAPIkey(key, (isValid) => {
      if (isValid) {
        // save the key to the configuration if it is valid
        console.log("setting key")
        config.setKey(key);
        session.endDialog('Key authenticated. Welcome!');
      } else {
        console.log("asking for key again")
        session.replaceDialog(dialogs.login.id, { reprompt: true });
      }
    });
    console.log("huh");
  },
];
