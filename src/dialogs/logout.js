const builder = require('botbuilder');
const smartResponse = require('./smartResponse');
const config = require('../config');

module.exports = [
  (session) => {
    builder.Prompts.choice(
      session,
      'This will wipe your current session and API key. Are you sure?',
      'Yes|No', { listStyle: 3 },
    );
  },
  (session, results) => {
    if (results.response.entity === 'Yes') {
      // Don't reset conversationData so that the bot doesn't
      // reintroduce itself upon logging out / in again
      session.userData = {};
      session.privateConversationData = {};
      session.dialogData = {};
      session.save();
      config.resetKey();
      const dialog = smartResponse.yesLogoutResponse();
      session.endDialog(dialog);
    } else {
      const dialog = smartResponse.notLogoutResponse();
      session.endDialog(dialog);
    }
  },
];
