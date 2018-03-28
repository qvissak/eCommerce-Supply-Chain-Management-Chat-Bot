const builder = require('botbuilder');
const { dialogs } = require('../utils/constants');
const config = require('../config');
const apiStore = require('../apis/apiStore');

module.exports = [
  function (session, args) {
    const text = args && args.reprompt
      ? 'Your API key is invalid. Please try again.'
      : 'Please enter your Logicbroker API key';
    builder.Prompts.text(session, text);
  },
  function (session, results) {
    const key = results.response;
    session.userData.apiKey = key;
    // API key validation (async)
    session.send(`Validating your API key, ${key}`);
    apiStore.auth.validateAPIkey(key, (isValid) => {
      if (isValid) {
        // save the key to the configuration if it is valid
        config.setKey(key);
        session.endDialog();
      } else {
        session.replaceDialog(dialogs.login.id, { reprompt: true });
      }
    });
  },
];

