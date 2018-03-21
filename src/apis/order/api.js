const Promise = require('bluebird');
const request = require('../helpers/request');
const moment = require('moment');

// TODO: Get an order by order number
// Make 3 api calls and try to find it
// const getOrderByID = (orderNumber) => 

// Get all orders within the last two weeks by default of all statuses
// TODO: implement paging
const getOrders = (fromDate, toDate, statusStr, page = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const from = fromDate || moment().subtract(14, 'days').format('MM-DD-YYYY');
      const to = toDate || '';
      const status = statusStr || '';
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
