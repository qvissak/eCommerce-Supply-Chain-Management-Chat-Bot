const Promise = require('bluebird');
const request = require('../helpers/request');

const getOrders = (status = '') => new Promise(async (resolve) => {
  try {
    const req = status ? request.get('/v2/Orders', { status }) : request.get('/v2/Orders');
    const res = await req;
    resolve(res);
  } catch (e) {
    resolve(e);
  }
});

const getReadyOrders = () => new Promise(async (resolve) => {
  try {
    const res = await request.get('/v2/Orders/Ready');
    resolve(res);
  } catch (e) {
    resolve(e);
  }
});

module.exports = {
  getOrders,
  getReadyOrders,
};
