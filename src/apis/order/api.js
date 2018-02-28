const Promise = require('bluebird');
const request = require('../helpers/request');
const moment = require('moment');

const getOrders = (from = moment().subtract(14, 'days').format('MM-DD-YYYY'), status = '') => new Promise(async (resolve, reject) => {
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

module.exports = {
  getOrders,
  getReadyOrders,
};
