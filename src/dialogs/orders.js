const builder = require('botbuilder');
const { entities, statusStr2Int, statusInt2Str } = require('../utils/constants');
const ordersAPI = require('../apis/order/index');
const orderAPIHelper = require('./helpers/orders');
const  { toDialogString } = orderAPIHelper;

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
  const status = statusStr.toDialogString().toLowerCase();

  if (resp && resp.length > 0) {
    session.send(`I found ` + `${resp.length} ${status} order${singular ? '.' : 's.'}`);
    for (const o of resp)
      session.send(`Order ${o.OrderNumber}`);
  } else {
    session.send(`There are no ${status} orders at this time.`);
  }
} 

const displayOpenOrders = (session, orders) => {
  const resp = orderAPIHelper.getOpenOrders(orders);
  displayOrderResponse(session, resp, 'Open');
}

const displayOrdersByStatus = (session, orders, statusInt) => {
  const resp = orderAPIHelper.getOrdersByStatus(orders, statusInt);
  const statusStr = statusInt2Str[statusInt];
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

      // Capture intent from user
      const { intent } = args;
      const orderNumber = builder.EntityRecognizer.findEntity(intent.entities, entities.orderNumber);
      const open = builder.EntityRecognizer.findEntity(intent.entities, entities.openOrder);
      const failed = builder.EntityRecognizer.findEntity(intent.entities, entities.failedOrder);
      const cancelled = builder.EntityRecognizer.findEntity(intent.entities, entities.cancelledOrder);
      const completed = builder.EntityRecognizer.findEntity(intent.entities, entities.completedOrder);
      const r2Ack = builder.EntityRecognizer.findEntity(intent.entities, entities.r2AckOrder);
      const r2Invoice = builder.EntityRecognizer.findEntity(intent.entities, entities.r2InvoiceOrder);
      const r2Ship = builder.EntityRecognizer.findEntity(intent.entities, entities.r2ShipOrder);
      const dateTime = builder.EntityRecognizer.findEntity(intent.entities, entities.dateTime);

      // Response provided with an order number
      if (orderNumber)
        displayOrderByNumber(session, orders, orderNumber.entity);
      // Response to show open orders
      else if (open)
        displayOpenOrders(session, orders);
      // Response to show failed orders
      else if (failed)
        displayOrdersByStatus(session, orders, statusStr2Int.Failed);
      // Response to show cancelled orders
      else if (cancelled)
        displayOrdersByStatus(session, orders, statusStr2Int.Cancelled);
      // Response to show completed orders
      else if (completed)
        displayOrdersByStatus(session, orders, statusStr2Int.Complete);
      // Response to show ready to ack orders
      else if (r2Ack)
        displayOrdersByStatus(session, orders, statusStr2Int.R2Ack);
      // Response to show ready to invoice orders
      else if (r2Invoice)
        displayOrdersByStatus(session, orders, statusStr2Int.R2Invoice);
      // Response to show ready to ship orders
      else if (r2Ship)
        displayOrdersByStatus(session, orders, statusStr2Int.R2Ship);
      // Default response
      else
        session.send('I was unable to determine what you need. Can you be more specific?');

      session.endDialog();
    } catch (e) {
      console.error(e.message);
      session.send('Error!');
      session.endDialog();
    }
  },
];
