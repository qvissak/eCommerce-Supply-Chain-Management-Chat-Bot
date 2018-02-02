const request = require('request-promise');
const _ = require('lodash');
const config = require('../../config');

const reqPromise = (uri, method, qsp = {}, body = undefined) => {
  const queryParams = _.merge({}, { 'subscription-key': config.apiKey }, qsp);
  let qs = '';
  Object.keys(queryParams).forEach((param, index) => {
    const sep = index === 0 ? '?' : '&';
    qs += `${sep}${param}=${queryParams[param]}`;
  });
  const opts = {
    uri: `https://stage.commerceapi.io/api/${uri}${qs}`,
    method,
    json: true,
  };

  return body
    ? request({
      ...opts,
      body,
    })
    : request(opts);
};

/**
 * Make get request to uri
 * @param {String} uri
 * @param {Object} queryParams
 * @returns {Promise}
 */
const get = (uri, queryParams) => reqPromise(uri, 'GET', queryParams);

/**
 * Make post request to uri
 * @param {String} uri
 * @param {Object} queryParams
 * @param {Object} body
 * @returns {Promise}
 */
const post = (uri, queryParams, body) => reqPromise(uri, 'POST', queryParams, body);

/**
 * Make delete request to uri
 * @param {String} uri
 * @param {Object} queryParams
 * @returns {Promise}
 */
const del = (uri, queryParams) => reqPromise(uri, 'DELETE', queryParams);

/**
 * Make put request to uri
 * @param {String} uri
 * @param {Object} queryParams
 * @param {Object} body
 * @returns {Promise}
 */
const put = (uri, queryParams, body) => reqPromise(uri, 'PUT', queryParams, body);

module.exports = {
  get,
  post,
  del,
  put,
};
