const Promise = require('bluebird');
const request = require('../helpers/request');
const moment = require('moment');

const getOrders = (from = moment().subtract(14, 'days').format('MM-DD-YYYY'), status = '') =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await request.get('/v2/Orders', { from, status });
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
* @param {Array of Strings} LogicbrokerKeys - all 6 digit company ids to update
*/
const putStatusOrders = (Status, OnlyIncreaseStatus = false, LogicbrokerKeys) =>
  new Promise(async (resolve, reject) => {
    try {
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
};
