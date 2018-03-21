const builder = require('botbuilder');
const { entities, statusStr2Int, statusInt2Str } = require('../utils/constants');
const ordersAPI = require('../apis/order/index');
const orderAPIHelper = require('./helpers/orders');
const { logger } = require('../utils/logger');

const displayOrderDetails = (session, order) => {
  // TODO: show cards offering different information about the order
  session.send('Ok, here is information about the order...');
  return order;
};

const displayOrderBillingAddress = (session, order) => {
  const address = orderAPIHelper.getOrderBillingAddress(order);
  if (address && address.length > 0) {
    session.send(address);
  } else {
    session.send('Sorry, there is no billing address for that order.');
  }
};

const displayOrderShippingAddress = (session, order) => {
  const address = orderAPIHelper.getOrderShippingAddress(order);
  if (address && address.length > 0) {
    session.send(address);
  } else {
    session.send('Sorry, there is no shipping address for that order.');
  }
};

const displayOrderLineItems = (session, order) => {
  const lineItems = orderAPIHelper.getOrderLineItems(order);
  if (lineItems && lineItems.length > 0) {
    lineItems.forEach(item => session.send(item));
  } else {
    session.send('Sorry, there are no line items for that order.');
  }
};

const displayOrderResponse = (session, resp, statusStr) => {
  const singular = resp.length === 1;
  const status = statusStr.toDialogString().toLowerCase();

  if (resp && resp.length > 0) {
    session.send(`I found ${resp.length} ${status} order${singular ? '.' : 's.'}`);
    resp.forEach(order => session.send(`Order ${order.OrderNumber}`));
  } else {
    session.send(`There are no ${status} orders at this time.`);
  }
};

const displayOpenOrders = (session, orders) => {
  const resp = orderAPIHelper.getOpenOrders(orders);
  displayOrderResponse(session, resp, 'Open');
};

const displayOrdersByStatus = (session, orders, statusInt) => {
  const resp = orderAPIHelper.getOrdersByStatus(orders, statusInt);
  const statusStr = statusInt2Str[statusInt];
  displayOrderResponse(session, resp, statusStr);
};

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
      const orderBillingAddr = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderBillingAddress);
      const orderShippingAddr = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderShippingAddress);
      const orderLineItems = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderLineItems);
      const dateTime = builder.EntityRecognizer.findEntity(intent.entities, entities.dateTime);
      if (orderNumber) {
        // Response provided with an order number
        const order = orderAPIHelper.getOrderByIdentifier(orders, orderNumber.entity.replace(' ', ''));
        if (order) {
          if (orderBillingAddr) {
            displayOrderBillingAddress(session, order);
          } else if (orderShippingAddr) {
            displayOrderShippingAddress(session, order);
          } else if (orderLineItems) {
            displayOrderLineItems(session, order);
          } else {
            displayOrderDetails(session, order);
          }
        } else {
          session.send(`Order ${orderNumber.entity.replace(' ', '')} not found.`);
        }
      } else if (open) {
        // Response to show open orders
        displayOpenOrders(session, orders);
      } else if (failed) {
        // Response to show failed orders
        displayOrdersByStatus(session, orders, statusStr2Int.Failed);
      } else if (cancelled) {
        // Response to show cancelled orders
        displayOrdersByStatus(session, orders, statusStr2Int.Cancelled);
      } else if (completed) {
        // Response to show completed orders
        displayOrdersByStatus(session, orders, statusStr2Int.Complete);
      } else if (r2Ack) {
        // Response to show ready to ack orders
        displayOrdersByStatus(session, orders, statusStr2Int.R2Ack);
      } else if (r2Invoice) {
        // Response to show ready to invoice orders
        displayOrdersByStatus(session, orders, statusStr2Int.R2Invoice);
      } else if (r2Ship) {
        // Response to show ready to ship orders
        displayOrdersByStatus(session, orders, statusStr2Int.R2Ship);
      } else {
        // Default response
        session.send('I was unable to determine what you need. Can you be more specific?');
      }
      session.endDialog();
    } catch (e) {
      logger.error('Retrieving Orders', e);
      console.error(e.message);
      session.send('An error occurred!');
      session.endDialog();
    }
  },
];
