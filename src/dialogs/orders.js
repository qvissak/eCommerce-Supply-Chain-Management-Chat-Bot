const builder = require('botbuilder');

module.exports = [
  (session, args) => {
    // Resolve and store any Orders.Number entity passed from LUIS.
    const { intent } = args;
    const orderNumber = builder.EntityRecognizer.findEntity(intent.entities, 'Orders.Number');
    const openOrders = builder.EntityRecognizer.findEntity(intent.entities, 'Orders.Open');
    const failedOrders = builder.EntityRecognizer.findEntity(intent.entities, 'Orders.Failed');

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
