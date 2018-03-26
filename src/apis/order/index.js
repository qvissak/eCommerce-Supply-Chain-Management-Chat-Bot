const Promise = require('bluebird');
const _ = require('lodash');
const api = require('./api');

const getOrderById = orderNumber => new Promise(async (resolve, reject) => {
  try {
    const res = await api.getOrders();
    const order = _.find(res.Records, o => o.OrderNumber === orderNumber);
    resolve(order);
  } catch (e) {
    reject(e);
  }
});

const { getOrders, getReadyOrders, putStatusOrders } = api;

// TODO: Get Array of order numbers that are ready

module.exports = {
  getOrderById,
  // function that makes at most 3 api requests to find order by identifier
  getOrderByIdentifier: api.getOrderByID,
  getOrders,
  getReadyOrders,
  putStatusOrders,
};
