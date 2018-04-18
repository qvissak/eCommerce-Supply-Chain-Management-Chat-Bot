const smartResponse = require('./smartResponse');

module.exports = [
  (session) => {
    const niceDialog = smartResponse.niceResponse();
    session.endDialog(niceDialog);
  },
];
