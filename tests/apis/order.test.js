const ordersApi = require('../../src/apis/order/api');
// set up the configuration API key with Siena's key
require('../../src/config').setKey('9C39DFA4-E061-4B3E-9504-CBDB4EDB070D');

const orderResHelper = (data) => {
  expect(data.Records).to.exist;
  expect(_.isArray(data.Records)).to.be.true;
  expect(data.TotalPages).to.exist;
  expect(_.isInteger(data.TotalPages)).to.be.true;
};

describe('Order Endpoints - LogicBroker API Service', function() {
  describe('getOrders', function() {
    it('no parameter should return all orders', function() {
      return ordersApi.getOrders()
        .then((data) => {
          orderResHelper(data);
        });
    });
    it('status parameter set to Ignored should return only Ignored orders ', function() {
      return ordersApi.getOrders(undefined, undefined, 'Ignored')
        .then((data) => {
          orderResHelper(data);
        });
    });
    it('status parameter set to Cancelled should return only Cancelled orders ', function() {
      return ordersApi.getOrders(undefined, undefined, 'Cancelled')
        .then((data) => {
          orderResHelper(data);
        });
    });
  });

  describe('getReadyOrders', function() {
    it('should return orders that are ready to ship', function() {
      return ordersApi.getReadyOrders()
        .then((data) => {
          expect(data.Records).to.exist;
          expect(_.isArray(data.Records)).to.be.true;
          expect(data.TotalRecords).to.exist;
        });
    });
  });
});
