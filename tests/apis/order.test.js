const ordersApi = require('../../src/apis/order');

const orderResHelper = (data) => {
  expect(data.SalesOrders).to.exist;
  expect(_.isArray(data.SalesOrders)).to.be.true;
  expect(data.TotalPages).to.exist;
  expect(_.isInteger(data.TotalPages)).to.be.true;
};

describe('Order Endpoints - LogicBroker API Service', function() {
  describe('getOrders', function() {
    it('no parameter should return all orders', async function() {
      return ordersApi.getOrders()
        .then((data) => {
          orderResHelper(data);
        });
    });
    it('status parameter set to Ignored should return only Ignored orders ', async function() {
      return ordersApi.getOrders('Ignored')
        .then((data) => {
          orderResHelper(data);
          data.SalesOrders.forEach(order => expect(order.Status === 'Ignored').to.be.true);
        });
    });
    it('status parameter set to Cancelled should return only Cancelled orders ', async function() {
      return ordersApi.getOrders('Cancelled')
        .then((data) => {
          orderResHelper(data);
          data.SalesOrders.forEach(order => expect(order.Status === 'Cancelled').to.be.true);
        });
    });
  });
});
