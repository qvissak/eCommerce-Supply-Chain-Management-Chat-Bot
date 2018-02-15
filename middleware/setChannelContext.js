const parseSlackMessage = message => message.replace(process.env.SLACK_HANDLE, '');

module.exports.botbuilder = (session, next) => {
  if (session.message.address.channelId === 'slack') {
    session.message.text = parseSlackMessage(session.message.text);
  }
  next();
};
