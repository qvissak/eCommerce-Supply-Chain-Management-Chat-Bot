const Promise = require('bluebird');

module.exports = {
  validateAPIKey: key =>
    new Promise(((resolve) => {
      const response = '{ "data" : "this is a fake response" }';
      // complete promise with a timer to simulate async response
      setTimeout(() => { resolve(response); }, 2000);
    })),
};
