var builder = require('botbuilder');
var logicbrokerService = require('./logicbroker-service');

module.exports = [
    // API key retrieval
    function (session) {
        builder.Prompts.text(session, 'Please enter your Logicbroker API key');
    },
    function (session, results, next) {
        session.dialogData.logicbrokerAPIKey = results.response;
        next();
    },
    // API key validation
    function (session) {
        var key = session.dialogData.logicbrokerAPIKey;
        session.send('Validating your API key, %s', key);

        // async
        logicbrokerService.validateAPIKey(key)
			.then(function (response) {
                session.send('Check the console for the server\'s response to your API key');
				console.log('Logicbroker response:', response);
                // make sure to end dialog in async callback/handler
                session.endDialog();
            });
    }
];
