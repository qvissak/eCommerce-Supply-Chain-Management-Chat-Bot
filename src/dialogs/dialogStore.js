// Put all dialog imports in this file to minimize confusion in app.js file
const order = require('./orders');
const login = require('./login');
const logout = require('./logout');
const help = require('./help');
const hello = require('./hello');
const updateOrderStatus = require('./updateOrderStatus');
const getOrderStatus = require('./getOrderStatus');
const showResults = require('./showResults');
const insultDialog = require('./insultDialog');

module.exports = {
  order,
  login,
  logout,
  help,
  hello,
  updateOrderStatus,
  getOrderStatus,
  showResults,
  insultDialog
};
