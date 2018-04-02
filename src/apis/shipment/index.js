const api = require('./api');

const { getShipments, getReadyShipments } = api;

module.exports = {
  getShipments,
  getReadyShipments,
};
