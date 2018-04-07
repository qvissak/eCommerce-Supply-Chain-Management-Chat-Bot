const builder = require('botbuilder');
const smartResponse = require('./smartResponse');

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
      session.userData = {};
      session.privateConversationData = {};
      // Comment out so that the bot doesn't reintroduce itself upon logging out / in again
      // session.conversationData = {};
      session.dialogData = {};
      session.save();
      const dialog = smartResponse.yesLogoutResponse();
      session.endDialog(dialog);
    } else {
      const dialog = smartResponse.notLogoutResponse();
      session.endDialog(dialog);
    }
  },
];
