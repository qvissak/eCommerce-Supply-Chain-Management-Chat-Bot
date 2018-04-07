const statusApi = require('../../src/apis/status/api');
const statusUtil = require('../../src/apis/status/index');

const statusResHelper = (data) => {
  expect(data.DocumentTypeStatuses).to.exist;
  expect(_.isArray(data.DocumentTypeStatuses)).to.be.true;
  expect(data.DocumentTypeStatuses.length).to.be.at.least(1);
};

describe('Status Endpoints - LogicBroker API Service', function() {
  describe('getStatuses', function() {
    it('No parameter should return 61 status types', function() {
      return statusApi.getStatuses()
        .then((data) => {
          statusResHelper(data);
        });
    });
  });
});

describe('Status Utilities - LogicBroker API Service', function() {
  describe('filterStatuses', function() {
    it('Given "order" document type and "submitted" status description, should return status id 100', function() {
      return statusUtil.filterStatuses('Order', 'Submitted')
        .then((data) => {
          expect(data).to.equal(100);
        });
    });
  });
});
