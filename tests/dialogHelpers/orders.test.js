const orderHelper = require('../../src/dialogs/helpers/orders');
const api = require('../../src/apis/order/index');
const statusApi = require('../../src/apis/status/index');
const { statusStr2Int } = require('../../src/utils/constants');

const { getStatuses } = statusApi;

describe('Dialog Order Utils', function() {
  let records;
  let statuses;

  before(function(done) {
    Promise.all([api.getOrders(), getStatuses()])
      .then(([orderRes, statusesRes]) => {
        records = orderRes.Records;
        statuses = statusesRes.DocumentTypeStatuses;
        done();
      });
  });

  it('getOrderByIdentifier should work', function() {
    const orderNumber = '000000095';
    const orderDetails = orderHelper.getOrderByIdentifier(records, orderNumber);
    orderDetails
      ? expect(orderDetails.OrderNumber).to.equal(orderNumber)
      : expect(orderDetails).to.be.undefined;
  });

  it('getOrderBillingAddress should work', function() {
    const orderNumber = 'TEST0074';
    const order = orderHelper.getOrderByIdentifier(records, orderNumber);
    const addr = orderHelper.getOrderBillingAddress(order);
    expect(addr).to.have.lengthOf.at.least(1);
  });

  it('getOrderShippingAddress should work', function() {
    const orderNumber = 'TEST0074';
    const order = orderHelper.getOrderByIdentifier(records, orderNumber);
    const addr = orderHelper.getOrderShippingAddress(order);
    expect(addr).to.have.lengthOf.at.least(1);
  });

  it('getOrderLineItems should work', function() {
    const orderNumber = 'TEST0074';
    const order = orderHelper.getOrderByIdentifier(records, orderNumber);
    const lineItems = orderHelper.getOrderLineItems(order);
    expect(lineItems).to.have.lengthOf.at.least(1);
  });

  it('getOrdersByStatus should work', function() {
    const statusCode = statusStr2Int.Cancelled;
    const cancelledOrders = orderHelper.filterOrdersByStatus(records, statusCode);
    expect(cancelledOrders).to.exist;
  });

  it('getOpenOrders should work', function() {
    const openOrders = orderHelper.getOpenOrders(records);
    expect(openOrders).to.exist;
  });

  it('getIdentifiers should work', function() {
    const orderIdentifiers = orderHelper.getIdentifiers(records);
    orderIdentifiers.every(i => expect(i).to.include.keys('LinkKey', 'LogicbrokerKey', 'SourceKey'));
  });

  it('getMenuData should work', function() {
    const menuData = orderHelper.getMenuData(records, statuses);
    menuData.every((i) => {
      expect(i).to.have.all.keys('identifier', 'orderNumber', 'orderDate', 'status');
      expect(Object.keys(i.identifier)).to.have.lengthOf(3);
    });
  });
});
