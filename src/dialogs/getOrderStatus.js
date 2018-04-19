const builder = require('botbuilder');
const { entities, statusInt2Str } = require('../utils/constants');
const apiStore = require('../apis/apiStore');
const config = require('../config');
const { logger } = require('../utils/logger');
const { checkForLogin } = require('./helpers/auth');

const displayOrderStatus = async (session, orderNumber) => {
  session.send('Give me one second, retrieving info for ' +
    `order number ${orderNumber}...`);
  try {
    const resp = await apiStore.order.getOrderByID(orderNumber);
    const statusCode = resp.StatusCode;
    const status = statusInt2Str[statusCode].toDialogString().toLowerCase();
    session.send(`Order ${orderNumber} is in status ${status} (${statusCode}).`);
  } catch (e) {
    session.send(`${e.error.Message}`);
    logger.error('Display Get Order Status', e);
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

      // Response provided with an order number
      if (orderNumber) {
        displayOrderStatus(session, orderNumber.entity.replace(' ', ''));
      } else {
        session.send('I was unable to determine what you need. Can you be more specific?');
      }

      session.endDialog();
    } catch (e) {
      session.send('Error!');
      logger.error('Get Order Status', e);
      session.endDialog();
    }
  },
];
