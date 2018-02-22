const builder = require('botbuilder');
const { entities, statusStr2Int } = require('../utils/constants');
const ordersAPI = require('../apis/order/index');
const orderAPIHelper = require('./helpers/orders');

module.exports = [
  async (session, args) => {
    try {
      const orders = (await ordersAPI.getOrders()).Records;
      session.userData.orders = orders;
      console.log(`Retrieved all orders. Number of orders is ${orders.length}`);
      const { intent } = args;
      const orderNumber = builder.EntityRecognizer.findEntity(intent.entities, entities.orderNumber);
      const openOrders = builder.EntityRecognizer.findEntity(intent.entities, entities.openOrder);
      const failedOrders = builder.EntityRecognizer.findEntity(intent.entities, entities.failedOrder);
      const cancelledOrders = builder.EntityRecognizer.findEntity(intent.entities, entities.canceledOrder);

      if (orderNumber) {
        session.send(`Ok, retrieving info for order number ${orderNumber.entity}.`);
        const o = orderAPIHelper.getOrderByNumber(orders, orderNumber.entity);
        if (o) {
          session.send('Order found. Check the console log.');
          console.log(`Order found, result is\n${JSON.stringify(o)}`);
        } else {
          session.send(`Order ${orderNumber.entity} not found.`);
        }
      } else if (openOrders) {
        const open = orderAPIHelper.getOpenOrders(orders);
        if (open && open.length > 0) {
          session.send(`Found ${open.length} open order${open.length === 1 ? '.' : 's.'}`);
          for (const o of open) {
            session.send(`Order ${o.OrderNumber}`);
          }
        } else {
          session.send('No open orders.');
        }
      } else if (failedOrders) {
        session.send('Ok, retrieving failed orders');
      } else if (cancelledOrders) {
        session.send('Ok, retrieving cancelled orders.');
        const cancelled = orderAPIHelper.getOrdersByStatus(orders, statusStr2Int.Cancelled);
        if (cancelled && cancelled.length > 0) {
          session.send(`Found ${cancelled.length} cancelled order${cancelled.length === 1 ? '.' : 's.'}`);
          for (const o of cancelled) {
            session.send(`Order ${o.OrderNumber}`);
          }
        } else {
          session.send('No cancelled orders.');
        }
      } else {
        session.send('Oops... I failed.');
      }
      session.endDialog();
    } catch (e) {
      console.error(e.message);
      session.send('Error!');
      session.endDialog();
    }
  },
];
