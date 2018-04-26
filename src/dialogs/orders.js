const builder = require('botbuilder');
const {
  entities,
  statusStr2Int,
  statusInt2Str,
  dialogs,
} = require('../utils/constants');
const orderAPIHelper = require('./helpers/orders');
const apiStore = require('../apis/apiStore');
const logger = require('../utils/logger');
const config = require('../config');
const dateHelper = require('./helpers/dates');
const { checkForLogin } = require('./helpers/auth');
const moment = require('moment');
const smartResponse = require('./smartResponse');

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

const displayOpenOrIncompleteOrders = async (session, dateTime, open = false) => {
  try {
    const payload = await orderAPIHelper.getOrdersByStatus(session, dateTime);
    const payloadOpen = open
      ? orderAPIHelper.getOpenOrders(payload)
      : orderAPIHelper.getIncompleteOrders(payload);

    const fromDate = dateTime && dateTime.start
      ? moment(dateTime.start).format('MM-DD-YYYY')
      : moment().subtract(14, 'days').format('MM-DD-YYYY');
    const toDate = dateTime && dateTime.end
      ? moment(dateTime.end).format('MM-DD-YYYY')
      : moment().format('MM-DD-YYYY');

    if (payloadOpen.Records.length > 0) {
      session.send(`I found ${payloadOpen.Records.length} open orders for you, ` +
       `created in our system between ${fromDate} and ${toDate}.`);
      session.beginDialog(dialogs.showResults.id, { payload: payloadOpen, statusStr: 'Open' });
    } else {
      session.send(`There are no open orders between ${fromDate} and ${toDate}.`);
    }
  } catch (err) {
    logger.error(err);
    const errorDialog = smartResponse.errorResponse();
    session.send(`${errorDialog} 'getting open orders.`);
  }
};

const displayOrdersByStatus = async (session, dateTime, statusInt) => {
  try {
    const payload = await orderAPIHelper.getOrdersByStatus(session, dateTime, statusInt);
    const statusStr = statusInt2Str[statusInt];

    const fromDate = dateTime && dateTime.start
      ? dateTime.start
      : moment().subtract(14, 'days').format('MM-DD-YYYY');
    const toDate = dateTime && dateTime.end ? dateTime.end : moment().format('MM-DD-YYYY');

    if (payload.Records.length > 0) {
      session.send(`I found ${payload.Records.length} orders for you, ` +
      `created in our system between ${fromDate} and ${toDate}.`);
      session.beginDialog(dialogs.showResults.id, { payload, statusStr });
    } else {
      const status = statusStr.toDialogString().toLowerCase();
      session.send(`There are no ${status} orders between ${fromDate} and ${toDate}.`);
    }
  } catch (err) {
    const errorDialog = smartResponse.errorResponse();
    session.send(`${errorDialog} getting orders with status ${statusInt2Str[statusInt].toDialogString().toLowerCase()}.`);
    logger.log('Error', 'Error with getting orders by status %j', err);
  }
};

module.exports = [
  checkForLogin,
  async (session, args) => {
    try {
      // Capture intent from user
      const { intent } = config.getSavedArgs() || args;
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
      const incomplete = builder.EntityRecognizer
        .findEntity(intent.entities, entities.incompleteOrder);
      const newOrder = builder.EntityRecognizer.findEntity(intent.entities, entities.newOrder);
      const all = builder.EntityRecognizer.findEntity(intent.entities, entities.allOrders);
      const orderBillingAddr = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderBillingAddress);
      const orderShippingAddr = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderShippingAddress);
      const orderLineItems = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderLineItems);
      const details = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderDetails);
      const statusNumber = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderStatus);
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
            // Default response if order number is present without other intent
            session.send('Can you be a tad more specific? I see that you are inquiring about ' +
            'an order. Try asking for order details, the billing address, shipping address ' +
            `or line items for order ${orderNumber.entity}.`);
          }
        } catch (e) {
          const msg = e.error && e.error.Message ? e.error.Message : e.message;
          logger.error(msg);
          session.send(msg);
        }
      // Response to show orders by status number
      } else if (statusNumber) {
        const status = parseInt(statusNumber.entity, 10);
        if (!statusInt2Str[status]) {
          session.send(`Status number ${status} is not valid.`);
        } else {
          displayOrdersByStatus(session, dateTime, status);
        }
      // Response to show open orders
      } else if (open) {
        displayOpenOrIncompleteOrders(session, dateTime, true);
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
      } else if (incomplete) {
        displayOpenOrIncompleteOrders(session, dateTime);
      } else if (newOrder) {
        displayOrdersByStatus(session, dateTime, statusStr2Int.New);
      } else if (all) {
        displayOrdersByStatus(session, dateTime);
      // Default response
      } else {
        const confusedDialog = smartResponse.confusedResponse();
        session.send(confusedDialog);
      }
      session.endDialog();
    } catch (e) {
      session.send('I got an error!');
      logger.error('Retrieving Orders', e);
      session.endDialog();
    }
  },
];
