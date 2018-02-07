const Promise = require('bluebird');
const request = require('./helpers/request');

const getOrders = (status = '') => new Promise(async (resolve) => {
  try {
    // Using v1 since v2 raises Internal Server Error
    const req = status ? request.get('v2/Orders', { status }) : request.get('v2/Orders');
    const orderRes = await req;
    resolve(orderRes);
  } catch (e) {
    resolve(e);
  }
});

const getReadyOrders = () => new Promise(async (resolve) => {
  try {
    const orderRes = await request.get('v2/Orders/Ready');
    resolve(orderRes);
  } catch (e) {
    resolve(e);
  }
});

module.exports = {
  getOrders,
  getReadyOrders,
};
