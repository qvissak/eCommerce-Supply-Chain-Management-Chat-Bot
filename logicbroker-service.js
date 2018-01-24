var Promise = require('bluebird');

module.exports = {
    validateAPIKey: function (key) {
        return new Promise(function (resolve) {
            var response = '{ "data" : "this is a fake response" }';
            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(response); }, 1000);
        });
    }
};