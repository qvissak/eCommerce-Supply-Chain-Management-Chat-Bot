const smartResponse = require('./smartResponse');

module.exports = [
  (session) => {
    const meanDialog = smartResponse.insultResponse();
        session.endDialog(meanDialog);
  },
];