const request = require('../apis/helpers/request');

module.exports = {
	validateAPIKey: key => {
		return request.reqPromise('/v2/Acknowledgements',
									'GET',
									{ 'subscription-key': key },
									undefined,
									useDefaultApiKey = false)
		.then(response => true)
		.catch(err => false);
	}
};
