const { dialogs: { login } } = require('../../utils/constants');
const apiStore = require('../../apis/apiStore');
const config = require('../../config');

const checkForLogin = (session, args, next) => {
  config.setSavedArgs(args);
  if (!session.userData.validKey) {
    apiStore.auth.validateAPIkey(config.getKey(), (isValid) => {
      session.userData.validKey = isValid;
      if (!isValid) {
        session.send("I noticed you are not logged in! To use all of my features, you'll need to log in first.");
        session.beginDialog(login.id);
      }
      if (next) { next(args); }
    });
  } else if (next) { next(args); }
};

module.exports = { checkForLogin };
