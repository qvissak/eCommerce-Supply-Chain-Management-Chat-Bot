const builder = require('botbuilder');

module.exports =  [
    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.text(session, "Your API key is invalid. Please try again.")
        } else {
            builder.Prompts.text(session, "Please enter your Logicbroker API key");
        }
    },
    function (session, results) {
		const key = results.response;
        session.userData.apiKey = key;
		session.endDialog();
    }
];