// help dialog
module.exports = function (session, args, next) {
    session.send('In the future, I will print out a list of commands for you!');
	console.log('just called a prompt...');
	console.log('session = ', session);
	console.log('args = ', args);
	console.log('next = ', next);
	session.endDialog();
};