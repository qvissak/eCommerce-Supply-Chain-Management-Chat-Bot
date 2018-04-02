const Promise = require('bluebird');
const request = require('../helpers/request');

/*
* return - array of shipment records as objects
* status parameter - status of the document string format
* from parameter - beginning of time search window string date time format
* to parameter - end of time search window string date format
*/
const getShipments = (status, from, to) => new Promise(async (resolve, reject) => {
  try {
    const res = await request.get('/v2/Shipments', { status, from, to });
    resolve(res.Records);
  } catch (e) {
    reject(e);
  }
});

/*
* return - array of ready shipment records as objects
* from parameter - beginning of time search window string date time format
* to parameter - end of time search window string date format
*/
const getReadyShipments = (from, to) => new Promise(async (resolve, reject) => {
  try {
    const res = await request.get('/v2/Shipments/Ready', { from, to });
    resolve(res.Records);
  } catch (e) {
    reject(e);
  }
});

module.exports = {
  getShipments,
  getReadyShipments,
};
