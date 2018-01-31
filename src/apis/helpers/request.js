const request = require('request-promise');

const reqPromise = (uri, method, body=undefined) => {
  let opts = {
    uri: `https://stage.commerceapi.io/api/${uri}?subscription-key=${require('../../config').apiKey}`,
    method
  }
  return (body) ? request({
    ...opts,
    body
  }) : request(opts);
}

/**
 * Make get request to uri
 * @param {String} uri 
 * @returns {Promise}
 */
const get = (uri) => reqPromise(uri, 'GET');

/**
 * Make post request to uri
 * @param {String} uri 
 * @param {Object} body 
 * @returns {Promise}
 */
const post = (uri, body) => reqPromise(uri, 'POST', body);

/**
 * Make delete request to uri
 * @param {String} uri 
 * @returns {Promise}
 */
const del = (uri) => reqPromise(uri, 'DELETE');

/**
 * Make put request to uri
 * @param {String} uri 
 * @returns {Promise}
 */
const put = (uri) => reqPromise(uri, 'PUT', body);

module.exports = {
  get, 
  post,
  del,
  put,
}