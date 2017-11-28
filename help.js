module.exports = function (session) {
    session.send('In the future, I will print out a list of commands for you!');
	session.endDialog();
};