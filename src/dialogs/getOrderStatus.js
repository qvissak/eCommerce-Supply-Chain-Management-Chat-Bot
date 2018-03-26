const builder = require('botbuilder');
const { entities, statusInt2Str } = require('../utils/constants');
const apiStore = require('../apis/apiStore');
const { logger } = require('../utils/logger');


const displayOrderStatus = async (session, orderNumber) => {
  session.send('Give me one second, retrieving info for ' +
    `order number ${orderNumber}...`);
  const resp = await apiStore.order.getOrderByID(orderNumber);

  if (resp) {
    const statusCode = resp.StatusCode;
    const status = statusInt2Str[statusCode].toDialogString().toLowerCase();
    session.send(`Order ${orderNumber} is in status ${status} (${statusCode}).`);
  } else {
    session.send(`Order ${orderNumber} not found.`);
  }
};

module.exports = [
  async (session, args) => {
    try {
      // Capture intent from user
      const { intent } = args;
      const orderNumber = builder.EntityRecognizer
        .findEntity(intent.entities, entities.orderNumber);

      // Response provided with an order number
      if (orderNumber) {
        displayOrderStatus(session, orderNumber.entity);
      } else {
        session.send('I was unable to determine what you need. Can you be more specific?');
      }

      session.endDialog();
    } catch (e) {
      logger.error('Retrieving Orders', e);
      console.error(e.message);
      session.send('Error!');
      session.endDialog();
    }
  },
];
