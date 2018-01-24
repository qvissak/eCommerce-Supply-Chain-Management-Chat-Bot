module.exports = {
    validateAPIKey: (key) => 
        new Promise(function (resolve) {
            const response = '{ "data" : "this is a fake response" }';
            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(response); }, 1000);
        })
    }
};