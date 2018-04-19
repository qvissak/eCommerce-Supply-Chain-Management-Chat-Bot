const builder = require('botbuilder');
const { entities } = require('../utils/constants');
const apiStore = require('../apis/apiStore');
const config = require('../config');
const { logger } = require('../utils/logger');
const { checkForLogin } = require('./helpers/auth');

const updateOrderStatus = async (session, status, OnlyIncreaseStatus, LogicbrokerKeys) => {
  try {
    const response = await apiStore.order
      .putStatusOrders(status, OnlyIncreaseStatus, LogicbrokerKeys);
    return response.TotalRecords > 0;
  } catch (e) {
    session.send(`${e.error.Message}`);
    return false;
  }
};

const displayUpdateStatus = async (session, orderNumber, statusEntity) => {
  // omit "Orders.Status::" substring from statusEntity
  const status = statusEntity.substring(15).toDialogString();
  session.send('Give me one second, updating status of ' +
    `order number ${orderNumber} to "${status}".`);

  const OnlyIncreaseStatus = false;
  const LogicBrokerkeys = orderNumber.split(',');
  const verification = await
    updateOrderStatus(session, status, OnlyIncreaseStatus, LogicBrokerkeys);
  session.send(`Update ${verification ? 'successful!' : 'failed.'}`);
};

module.exports = [
  checkForLogin,
  async (session, args) => {
    try {
      // Capture intent and entities from user
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

      const status = open || failed || cancelled || completed || r2Ack ||
        r2Invoice || r2Ship || duplicate || submitted || ignored;

      // Response provided with an order number
      if (orderNumber && status) {
        displayUpdateStatus(session, orderNumber.entity, status.type);
      } else {
        session.send('I was unable to determine what you need. Can you be more specific?');
      }

      session.endDialog();
    } catch (e) {
      session.send('An error occurred!');
      logger.error('Update Order Status', e);
      session.endDialog();
    }
  },
];
