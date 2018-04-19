const request = require('./request');

const validateAPIkey = (key, callback) => {
  request.get('/v2/Acknowledgements', { 'subscription-key': key })
    .then(() => callback(true))
    .catch(() => callback(false));
};

module.exports = {
  validateAPIkey,
};
