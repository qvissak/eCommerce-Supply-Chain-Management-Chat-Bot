const builder = require('botbuilder');
const { dialogs: { orders: { entities } } } = require('../utils/constants');

const { number: orderNum, open: openOrder, failed: failedOrder } = entities;

module.exports = [
  (session, args) => {
    const { intent } = args;
    const orderNumber = builder.EntityRecognizer.findEntity(intent.entities, orderNum);
    const openOrders = builder.EntityRecognizer.findEntity(intent.entities, openOrder);
    const failedOrders = builder.EntityRecognizer.findEntity(intent.entities, failedOrder);

    if (orderNumber) {
      session.send('Ok, retrieving info for order number %s.', orderNumber.entity);
      // Code to retrieve info
    } else if (openOrders) {
      session.send('Ok, retrieving open orders');
    } else if (failedOrders) {
      session.send('Ok, retrieving failed orders');
    } else {
      session.send('Oops... I failed.');
    }
    session.endDialog();
  },
];
