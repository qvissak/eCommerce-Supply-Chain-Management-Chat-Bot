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

  it('getOrderByNumber should work', function() {
    const orderNumber = 'L8266355';
    const orderDetails = orderHelper.getOrderByNumber(records, orderNumber);
    expect(orderDetails.OrderNumber).to.equal(orderNumber);
  });

  it('getOrdersByStatus should work', function() {
    const statusCode = statusStr2Int.Cancelled;
    const cancelledOrders = orderHelper.getOrdersByStatus(records, statusCode);
    expect(cancelledOrders).to.exist;
    expect(cancelledOrders).to.have.lengthOf(1);
  });

  it('getOpenOrders should work', function() {
    const openOrders = orderHelper.getOpenOrders(records);
    expect(openOrders).to.exist;
    expect(openOrders).to.have.lengthOf(0);
  });

  it('getIdentifiers should work', function() {
    const orderIdentifiers = orderHelper.getIdentifiers(records);
    orderIdentifiers.every(i => expect(i).to.have.all.keys('LinkKey', 'LogicbrokerKey', 'SourceKey'));
  });

  it('getMenuData should work', function() {
    const menuData = orderHelper.getMenuData(records, statuses);
    menuData.every((i) => {
      expect(i).to.have.all.keys('identifier', 'orderNumber', 'orderDate', 'status');
      expect(Object.keys(i.identifier)).to.have.lengthOf(3);
    });
  });
});
