const builder = require('botbuilder');

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
    session.endDialog();
  },
];
