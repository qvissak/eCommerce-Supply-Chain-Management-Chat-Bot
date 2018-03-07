const builder = require('botbuilder');
const { entities, statusStr2Int, statusInt2Str } = require('../utils/constants');
const ordersAPI = require('../apis/order/index');
const orderAPIHelper = require('./helpers/orders');
const  { toDialogString } = orderAPIHelper;
	  
const displayUpdateStatus = (session, orders, orderNumber, statusEntity) => {
  const status = statusEntity.substring(15).toDialogString();
  session.send(`Give me one second, updating status of ` +
    `order number ${orderNumber} to "${status}".`);
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

      // Capture intent and entities from user
      const { intent } = args;
      const orderNumber = builder.EntityRecognizer.findEntity(intent.entities, entities.orderNumber);
      const open = builder.EntityRecognizer.findEntity(intent.entities, entities.openOrder);
      const failed = builder.EntityRecognizer.findEntity(intent.entities, entities.failedOrder);
      const cancelled = builder.EntityRecognizer.findEntity(intent.entities, entities.cancelledOrder);
      const completed = builder.EntityRecognizer.findEntity(intent.entities, entities.completedOrder);
      const r2Ack = builder.EntityRecognizer.findEntity(intent.entities, entities.r2AckOrder);
      const r2Invoice = builder.EntityRecognizer.findEntity(intent.entities, entities.r2InvoiceOrder);
      const r2Ship = builder.EntityRecognizer.findEntity(intent.entities, entities.r2ShipOrder);
      
      const status = open || failed || cancelled || completed || r2Ack
      	|| r2Invoice || r2Ship;

      // Response provided with an order number
      if (orderNumber && status)
        displayUpdateStatus(session, orders, orderNumber.entity, status.type);
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