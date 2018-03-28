const request = require('./request');

const validateAPIkey = async (key, callback) => {
  try {
    await request.get('/v2/Acknowledgements', { 'subscription-key': key });
    callback(true);
  } catch (e) {
    callback(false);
  }
};

module.exports = {
  validateAPIkey,
};
