// orders dialog
module.exports = function (session, args, next) {
  session.send('In the future, I will show order information');
  session.endDialog();
};
