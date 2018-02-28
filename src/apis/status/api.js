const Promise = require('bluebird');
const request = require('../helpers/request');

/*
* Return json object of DocumentTypeStatuses as a list of
* json objects with fields DocumentType, StatusDescription, StatusId,
* and Default
*/
const getStatuses = () => new Promise(async (resolve, reject) => {
  try {
    const res = await request.get('/v1/Statuses');
    resolve(res.Body);
  } catch (e) {
    reject(e);
  }
});

module.exports = {
  getStatuses,
};
