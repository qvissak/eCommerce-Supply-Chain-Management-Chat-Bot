const Promise = require('bluebird');
const _ = require('lodash');
const api = require('./api');

const { getShipments, getReadyShipments } = api;

module.exports = {
  getShipments,
  getReadyShipments,
};