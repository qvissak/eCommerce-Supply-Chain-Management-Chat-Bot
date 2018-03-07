module.exports = {
  botName: 'Elbi',
  dialogs: {
    login: {
      id: 'login',
    },
    help: {
      id: 'help',
      label: 'Help',
      intent: 'Utilities.Help',
    },
    orders: {
      id: 'orders',
      label: 'Orders',
      intent: 'GetOrders',
    },
    updateOrderStatus: {
      id: 'updateOrderStatus',
      label: 'UpdateOrderStatus',
      intent: 'UpdateOrderStatus',
    },
  },
  entities: {
    orderNumber: 'Orders.Number',
    openOrder: 'Orders.Status::Open',
    failedOrder: 'Orders.Status::Failed',
    cancelledOrder: 'Orders.Status::Cancelled',
    completedOrder: 'Orders.Status::Complete',
    r2AckOrder: 'Orders.Status::R2Ack',
    r2InvoiceOrder: 'Orders.Status::R2Invoice',
    r2ShipOrder: 'Orders.Status::R2Ship',
    dateTime: 'builtin.datetimeV2',
  },
  statusStr2Int: {
    /* Omitted draft (code -1) */
    New: 0,
    Submitted: 100,
    R2Ack: 150,
    Processing: 200,
    R2Ship: 500,
    R2Invoice: 600,
    Complete: 1000,
    Cancelled: 1100,
    Failed: 1200,
    Ignored: 1400,
  },
  statusInt2Str: {
    /* Omitted draft (code -1) */
    0: 'New',
    100: 'Submitted',
    150: 'R2Ack',
    200: 'Processing',
    500: 'R2Ship',
    600: 'R2Invoice',
    1000: 'Complete',
    1100: 'Cancelled',
    1200: 'Failed',
    1400: 'Ignored',
  },
};
