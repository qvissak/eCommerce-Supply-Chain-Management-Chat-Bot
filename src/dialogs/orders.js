const builder = require('botbuilder');
const { entities, statusStr2Int, statusInt2Str } = require('../utils/constants');
const orderAPIHelper = require('./helpers/orders');
const apiStore = require('../apis/apiStore');
const createCards = require('./helpers/cards');
const { logger } = require('../utils/logger');
const dateHelper = require('./helpers/dates');

const displayOrderDetails = (session, order) => {
  const info = orderAPIHelper.getOrderDetails(order);
  if (info && info.length > 0) {
    session.send(info);
  } else {
    session.send('Sorry, there is no information about this order.');
  }
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
  const status = statusStr.toDialogString().toLowerCase();

  if (resp && resp.length > 0) {
    // TODO: Find out which channels do not support cards
    const menuData = orderAPIHelper.getMenuData(resp, statusInt2Str);
    createCards.heroCards(session, menuData);
  } else {
    session.send(`There are no ${status} orders at this time.`);
  }
};

const displayOpenOrders = async (session, dateTime) => {
  try {
    const payload = await orderAPIHelper.getOrdersByStatus(session, dateTime);
    const payloadOpen = orderAPIHelper.getOpenOrders(payload);
    displayOrderResponse(session, payloadOpen.Records, 'Open');
  } catch (err) {
    console.error(err);
    session.send('An error occurred while getting open orders.');
  }
};

const displayOrdersByStatus = async (session, dateTime, statusInt) => {
  try {
    const payload = await orderAPIHelper.getOrdersByStatus(session, dateTime, statusInt);
    const statusStr = statusInt2Str[statusInt];
    displayOrderResponse(session, payload.Records, statusStr);
  } catch (err) {
    console.error(err);
    session.send(`An error occurred while getting orders with status ${statusInt2Str[statusInt]}.`);
  }
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
      const duplicate = builder.EntityRecognizer
        .findEntity(intent.entities, entities.duplicateOrder);
      const submitted = builder.EntityRecognizer
        .findEntity(intent.entities, entities.submittedOrder);
      const ignored = builder.EntityRecognizer.findEntity(intent.entities, entities.ignoredOrder);
      const orderBillingAddr = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderBillingAddress);
      const orderShippingAddr = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderShippingAddress);
      const orderLineItems = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderLineItems);
      const details = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderDetails);
      const date = builder.EntityRecognizer.findEntity(intent.entities, entities.date);
      const daterange = builder.EntityRecognizer.findEntity(intent.entities, entities.daterange);
      const datetimerange = builder.EntityRecognizer.findEntity(intent.entities, entities.datetr);

      // Resolve date/daterange/datetimerange intents to date object
      // i.e { start: '2017-01-03', end: '2018-01-13'}
      const dateTime = dateHelper.getDateTime(session, (date || daterange || datetimerange));

      // Response provided with an order number
      if (orderNumber) {
        try {
          const order = await apiStore.order.getOrderByID(orderNumber.entity);
          if (details) {
            displayOrderDetails(session, order);
          } else if (orderBillingAddr) {
            displayOrderBillingAddress(session, order);
          } else if (orderShippingAddr) {
            displayOrderShippingAddress(session, order);
          } else if (orderLineItems) {
            displayOrderLineItems(session, order);
          } else {
            displayOrderDetails(session, order);
          }
        } catch (e) {
          session.send(`${e.error.Message}`);
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
      // Response to show duplicate orders
      } else if (duplicate) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.Duplicate);
      // Response to show ignored orders
      } else if (ignored) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.Ignored);
      // Response to show submitted orders
      } else if (submitted) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.Submitted);
      // Default response
      } else {
        session.send('I was unable to determine what you need. Can you be more specific?');
      }
      session.endDialog();
    } catch (e) {
      logger.error('Retrieving Orders', e);
      console.error(e);
      session.send('An error occurred!');
      session.endDialog();
    }
  },
];
