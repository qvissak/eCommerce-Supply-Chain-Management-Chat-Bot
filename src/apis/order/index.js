const api = require('./api');

// TODO: Get Array of order numbers that are ready

const {
  getOrderByID,
  getOrders,
  getReadyOrders,
  putStatusOrders,
} = api;

module.exports = {
  getOrderByID, // function that makes at most 3 api requests to find order by identifier
  getOrders,
  getReadyOrders,
  putStatusOrders,
};
