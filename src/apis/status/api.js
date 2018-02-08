const Promise = require('bluebird');
const request = require('../helpers/request');

const getStatuses = () => new Promise(async (resolve) => {
  try {
    const res = await request.get('/v1/Statuses');
    resolve(res.Body);
  } catch (e) {
    resolve(e);
  }
});

module.exports = {
  getStatuses,
};
