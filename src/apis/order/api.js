const Promise = require('bluebird');
const request = require('../helpers/request');
const moment = require('moment');
const logger = require('../../utils/logger');

/**
 * Get an order by some unique identifier
 * i.e ID# or REFERENCE#
 * @param {Number or String} ident
 * @returns {Object}
 */
const getOrderByID = ident =>
  new Promise(async (resolve, reject) => {
    // Strip white space from LUIS order entity
    const identifier = ident.replace(/\s/g, '');
    const notFoundError = new Error(`Order ${identifier} not found!`);
    // Make 3 api calls and try to find it
    try {
      let res = await Promise.all([
        request.get('/v2/Orders', {
          linkkey: identifier,
        }),
        request.get('/v2/Orders', {
          sourceKey: identifier,
        }),
        request.get('/v2/Orders', {
          partnerPo: identifier,
        }),
      ]);
      res = res.filter(response => response.Records.length > 0);
      if (res.length !== 0) {
        // TODO: don't always necessarily take the first one in Records
        resolve(res[0].Records[0]);
      } else {
        res = await request.get(`/v1/Orders/${identifier}`, {});
        if (res.Body.SalesOrder) {
          resolve(res.Body.SalesOrder);
        } else throw notFoundError;
      }
    } catch (e) {
      logger.error('An error occurred in api.js getOrderByID! Error:', e);
      reject(notFoundError);
    }
  });

// Get all orders within the last two weeks by default of all statuses
// TODO: implement paging
const getOrders = (fromDate, toDate, statusStr, page = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const from = fromDate || moment().subtract(14, 'days').format('MM-DD-YYYY');
      const to = toDate || '';
      const status = statusStr !== undefined ? statusStr : '';
      const pageSize = 50;
      const res = await request.get('/v2/Orders', {
        from, to, status, page, pageSize,
      });
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });

const getReadyOrders = () => new Promise(async (resolve, reject) => {
  try {
    const res = await request.get('/v2/Orders/Ready');
    resolve(res);
  } catch (e) {
    reject(e);
  }
});

/**
* @param {String} Status - status code number to update
* @param {Boolean} OnlyIncreaseStatus - safeguard to prevent update to a lower status
* if true, status update of 1000 from 1400 would return { "Records" : [], ... }
* @param {Array of Strings} Identifiers - any type of id to update (PartnerPO,
* LogicbrokerKey, SourceKey)
*/
const putStatusOrders = (Status, OnlyIncreaseStatus = false, Identifiers) =>
  new Promise(async (resolve, reject) => {
    try {
      // Convert any identifiers into array of 6 digit logicbroker keys
      const LogicbrokerKeys = await Promise.all(Identifiers.map(async (ident) => {
        const info = await getOrderByID(ident);
        return info.Identifier.LogicbrokerKey;
      }));
      const res = await request.put('/v2/Orders/Status', {}, {
        Status, OnlyIncreaseStatus, LogicbrokerKeys,
      });
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });

module.exports = {
  getOrders,
  getReadyOrders,
  putStatusOrders,
  getOrderByID,
};
