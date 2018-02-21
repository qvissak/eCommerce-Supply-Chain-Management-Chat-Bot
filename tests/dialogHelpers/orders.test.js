const orderHelper = require('../../src/dialogs/helpers/orders');
const api = require('../../src/apis/order/index');
const statusApi = require('../../src/apis/status/index');

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
