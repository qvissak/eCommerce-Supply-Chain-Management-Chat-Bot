// help dialog
module.exports = function (session, args, next) {
    session.send('In the future, I will print out a list of commands for you!');
	session.endDialog();
};