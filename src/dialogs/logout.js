module.exports = [
  (session) => {
    session.userData = {};
    session.privateConversationData = {};
    session.conversationData = {};
    session.dialogData = {};
    session.save();
    session.endDialog('Successful log out.');
  },
];
