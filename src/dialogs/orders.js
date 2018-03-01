const builder = require('botbuilder');
const { entities, statusStr2Int, statusInt2Str } = require('../utils/constants');
const ordersAPI = require('../apis/order/index');
const orderAPIHelper = require('./helpers/orders');

const displayOrderByNumber = (session, orders, orderNumber) => {
  session.send(`Give me one second, retrieving info for ` +
    `order number ${orderNumber}...`);
  const resp = orderAPIHelper.getOrderByNumber(orders, orderNumber);

  if (resp) {
    session.send('Order found. Check the console log.');
    console.log(`Order found, result is\n${JSON.stringify(resp)}`);
  } else {
    session.send(`Order ${orderNumber} not found.`);
  }
}

const displayOrderResponse = (session, resp, statusStr) => {
  const singular = resp.length === 1;

  if (resp && resp.length > 0) {
    session.send(`I found ${singular ? 'a' : 'multiple'} ` + 
      `${resp.length} ${statusStr} order${singular ? '.' : 's.'}`);
    for (const o of resp)
      session.send(`Order ${o.OrderNumber}`);
  } else {
    session.send(`There are no ${statusStr} orders at this time.`);
  }
} 

const displayOpenOrders = (session, orders) => {
  const resp = orderAPIHelper.getOpenOrders(orders);
  displayOrderResponse(session, resp, 'Open');
}

const displayOrdersByStatus = (session, orders, statusInt) => {
  const resp = orderAPIHelper.getOrdersByStatus(orders, statusInt);
  const statusStr = statusInt2Str[statusInt].toLowerCase();
  displayOrderResponse(session, resp, statusStr);
}

module.exports = [
  async (session, args) => {
    try {
      // Get all orders within the last two weeks
      const tmp = await ordersAPI.getOrders();
      const orders = tmp.Records;
      const totalNumOrders = tmp.TotalRecords;

      // Set session data
      session.userData.orders = orders;
      session.userData.totalNumOrders = totalNumOrders;

      console.log(`Retrieved all orders. Number of orders is ${totalNumOrders}`);

      // Capture intent from user
      const { intent } = args;
      const orderNumber = builder.EntityRecognizer.findEntity(intent.entities, entities.orderNumber);
      const openOrders = builder.EntityRecognizer.findEntity(intent.entities, entities.openOrder);
      const failedOrders = builder.EntityRecognizer.findEntity(intent.entities, entities.failedOrder);
      const cancelledOrders = builder.EntityRecognizer.findEntity(intent.entities, entities.canceledOrder);

      // Response provided with an order number
      if (orderNumber)
        displayOrderByNumber(session, orders, orderNumber.entity);
      // Response to show open orders
      else if (openOrders)
        displayOpenOrders(session, orders);
      // Response to show failed orders
      else if (failedOrders)
        displayOrdersByStatus(session, orders, statusStr2Int.Failed);
      // Response to show cancelled orders
      else if (cancelledOrders)
        displayOrdersByStatus(session, orders, statusStr2Int.Cancelled);
      // Default response
      else
        session.send('Oops... I failed.');

      session.endDialog();
    } catch (e) {
      console.error(e.message);
      session.send('Error!');
      session.endDialog();
    }
  },
];
