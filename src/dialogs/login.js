const builder = require('botbuilder');
const { dialogs } = require('../utils/constants');
const config = require('../config');
const apiStore = require('../apis/apiStore');
const smartResponse = require('./smartResponse');

const demoKey = '9C39DFA4-E061-4B3E-9504-CBDB4EDB070D';

module.exports = [
  (session, args) => {
    const text = args && args.reprompt
      ? 'Your API key is invalid. Please try again.'
      : 'Please enter your Logicbroker API key to log in.';
    builder.Prompts.text(session, text);
  },
  (session, results) => {
    const useDemo = results.response.toLowerCase() === 'demo';
    const key = useDemo ? demoKey : results.response;
    session.userData.apiKey = key;
    let msg = `Validating your API key, ${key}.`;
    // Do not show API key when using demo
    if (useDemo) { msg = 'Validating your API key...'; }
    session.send(msg);
    // API key validation (async)
    apiStore.auth.validateAPIkey(key, (isValid) => {
      if (isValid) {
        config.setKey(key);
        const keyAuthDialog = smartResponse.keyAuthResponse();
        session.endDialog(keyAuthDialog);
      } else {
        session.replaceDialog(dialogs.login.id, { reprompt: true });
      }
    });
  },
];
