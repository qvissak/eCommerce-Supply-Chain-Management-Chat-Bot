const Promise = require('bluebird');
const _ = require('lodash');
const api = require('./api');

const filterStatuses = (documentType, statusDescription) => new Promise(async (resolve) => {
  try {
    const statuses = (await api.getStatuses()).DocumentTypeStatuses;
    const obj = _.find(statuses, e =>
      e.DocumentType === documentType && e.StatusDescription === statusDescription);
    resolve(obj.StatusId);
  } catch (e) {
    resolve(e);
  }
});

module.exports = {
  filterStatuses,
};
