const orderHelper = require('../../src/dialogs/helpers/orders');
const api = require('../../src/apis/order/index');
const statusApi = require('../../src/apis/status/index');
const { statusStr2Int } = require('../../src/utils/constants');

const { getStatuses } = statusApi;

describe('Dialog Order Utils', () => {
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

  it('getOrderBillingAddress should work', async () => {
    const orderNumber = 'TEST0074';
    const order = await api.getOrderByID(orderNumber);
    expect(order).to.exist;
    const addr = orderHelper.getOrderBillingAddress(order);
    expect(addr).to.have.lengthOf.at.least(1);
  });

  it('getOrderShippingAddress should work', async () => {
    const orderNumber = 'TEST0074';
    const order = await api.getOrderByID(orderNumber);
    expect(order).to.exist;
    const addr = orderHelper.getOrderShippingAddress(order);
    expect(addr).to.have.lengthOf.at.least(1);
  });

  it('getOrderLineItems should work', async () => {
    const orderNumber = 'TEST0074';
    const order = await api.getOrderByID(orderNumber);
    expect(order).to.exist;
    const lineItems = orderHelper.getOrderLineItems(order);
    expect(lineItems).to.have.lengthOf.at.least(1);
  });

  it('getOrdersByStatus should work', () => {
    const statusCode = statusStr2Int.Cancelled;
    const cancelledOrders = orderHelper.filterOrdersByStatus(records, statusCode);
    expect(cancelledOrders).to.exist;
  });

  it('getOpenOrders should work', () => {
    const openOrders = orderHelper.getOpenOrders(records);
    expect(openOrders).to.exist;
  });

  it('getIdentifiers should work', () => {
    const orderIdentifiers = orderHelper.getIdentifiers(records);
    orderIdentifiers.every(i => expect(i).to.include.keys('LinkKey', 'LogicbrokerKey', 'SourceKey'));
  });

  it('getMenuData should work', () => {
    const menuData = orderHelper.getMenuData(records, statuses);
    menuData.every((i) => {
      expect(i).to.have.all.keys('identifier', 'orderNumber', 'orderDate', 'status');
      expect(Object.keys(i.identifier)).to.have.lengthOf(3);
    });
  });
});
