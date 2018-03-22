// Put all dialog imports in this file to minimize confusion in app.js file
const order = require('./orders');
const login = require('./login');
const help = require('./help');
const hello = require('./hello');
const updateOrderStatus = require('./updateOrderStatus');
const getOrderStatus = require('./getOrderStatus');

module.exports = {
  order,
  login,
  help,
  hello,
  updateOrderStatus,
  getOrderStatus,
};
