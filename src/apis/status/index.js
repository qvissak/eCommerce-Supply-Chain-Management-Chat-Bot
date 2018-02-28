const Promise = require('bluebird');
const _ = require('lodash');
const api = require('./api');

const { getStatuses } = api;

/*
* Return - numbered status codes given a document type and status description
* document type - keywords such as "AdvanceShipmentNotice", "Order" or "Invoice"
* status description - keywords such as "Complete", "Cancelled", "Submitted" or "Failed"
* note - there's a one-to-one relationship between status id and status description
*/
const filterStatuses = (documentType, statusDescription) => new Promise(async (resolve, reject) => {
  try {
    const statuses = (await api.getStatuses()).DocumentTypeStatuses;
    const obj = _.find(statuses, e =>
      e.DocumentType === documentType && e.StatusDescription === statusDescription);
    resolve(obj.StatusId);
  } catch (e) {
    reject(e);
  }
});

module.exports = {
  filterStatuses,
  getStatuses,
};
