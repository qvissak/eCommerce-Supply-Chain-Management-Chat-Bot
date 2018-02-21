const Promise = require('bluebird');
const request = require('../helpers/request');

const getOrders = (status = '') => new Promise(async (resolve, reject) => {
  try {
    const res = await (status ? request.get('/v2/Orders', { status }) : request.get('/v2/Orders'));
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

module.exports = {
  getOrders,
  getReadyOrders,
};
