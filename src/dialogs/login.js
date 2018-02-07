const builder = require('botbuilder');
const logicbrokerService = require('../utils/logicbroker-service');
const constants = require('../utils/constants');

module.exports =  [
    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.text(session, "That API key was invalid. Please try again.")
        } else {
            builder.Prompts.text(session, "Please enter your Logicbroker API key");
        }
    },
    function (session, results) {
		const key = results.response;
        session.privateConversationData.apiKey = key;
		session.privateConversationData.validApiKey = false;
        // API key validation (async)
		session.send('Validating your API key, %s', key);
    	logicbrokerService.validateAPIKey(key)
    		.then((isValid) => {
				console.log(`response from endpoint is *** ${isValid} ***`);
				if (isValid) {
					session.privateConversationData.validApiKey = true;
					session.endDialog();
				} else {
					session.privateConversationData.validApiKey = false;
					session.replaceDialog(constants.dialogNames.login, { reprompt : true });
				}
    	});
    }
];