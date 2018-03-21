const builder = require('botbuilder');
const { entities, statusStr2Int, statusInt2Str } = require('../utils/constants');
const apiStore = require('../apis/apiStore');
const orderAPIHelper = require('./helpers/orders');
const { logger } = require('../utils/logger');
const dateHelper = require('./helpers/dates');

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

const getOrdersByStatus = async (session, dateTime = undefined, status = undefined) => {
  try {
    const from = dateTime ? dateTime.start : dateTime;
    const to = dateTime ? dateTime.end : dateTime;
    const response = await apiStore.order.getOrders(from, to, status);
    // Set session data
    session.userData.orders = response.Records;
    session.userData.totalNumOrders = response.TotalRecords;
    return response.Records;
  } catch (e) {
    session.send(`${e.error.Message}`);
    return [];
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

const displayOpenOrders = async (session, dateTime) => {
  const orders = await getOrdersByStatus(session, dateTime);
  const resp = orderAPIHelper.getOpenOrders(orders);
  displayOrderResponse(session, resp, 'Open');
};

const displayOrdersByStatus = async (session, dateTime, statusInt) => {
  const orders = await getOrdersByStatus(session, dateTime);
  const resp = orderAPIHelper.filterOrdersByStatus(orders, statusInt);
  const statusStr = statusInt2Str[statusInt];
  displayOrderResponse(session, resp, statusStr);
};

module.exports = [
  async (session, args) => {
    try {
      // Capture intent from user
      const { intent } = args;
      const orderNumber = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderNumber);
      const open = builder.EntityRecognizer.findEntity(intent.entities, entities.openOrder);
      const failed = builder.EntityRecognizer.findEntity(intent.entities, entities.failedOrder);
      const cancelled = builder.EntityRecognizer
        .findEntity(intent.entities, entities.cancelledOrder);
      const completed = builder.EntityRecognizer
        .findEntity(intent.entities, entities.completedOrder);
      const r2Ack = builder.EntityRecognizer.findEntity(intent.entities, entities.r2AckOrder);
      const r2Invoice = builder.EntityRecognizer
        .findEntity(intent.entities, entities.r2InvoiceOrder);
      const r2Ship = builder.EntityRecognizer.findEntity(intent.entities, entities.r2ShipOrder);
      const orderBillingAddr = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderBillingAddress);
      const orderShippingAddr = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderShippingAddress);
      const orderLineItems = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderLineItems);
      const date = builder.EntityRecognizer.findEntity(intent.entities, entities.date);
      const daterange = builder.EntityRecognizer.findEntity(intent.entities, entities.daterange);
      const datetimerange = builder.EntityRecognizer.findEntity(intent.entities, entities.datetr);

      // Resolve date/daterange/datetimerange intents to date object
      // i.e { start: '2017-01-03', end: '2018-01-13'}
      const dateTime = dateHelper.getDateTime(session, (date || daterange || datetimerange));

      // Response provided with an order number
      if (orderNumber) {
        const order = orderAPIHelper
          .getOrderByIdentifier(session.userData.orders, orderNumber.entity.replace(' ', ''));
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
      // Response to show open orders
      } else if (open) {
        displayOpenOrders(session, dateTime);
      // Response to show failed orders
      } else if (failed) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.Failed);
      // Response to show cancelled orders
      } else if (cancelled) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.Cancelled);
      // Response to show completed orders
      } else if (completed) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.Complete);
      // Response to show ready to ack orders
      } else if (r2Ack) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.R2Ack);
      // Response to show ready to invoice orders
      } else if (r2Invoice) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.R2Invoice);
      // Response to show ready to ship orders
      } else if (r2Ship) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.R2Ship);
      // Default response
      } else {
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
