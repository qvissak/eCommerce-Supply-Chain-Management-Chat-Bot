module.exports = {
  botName: 'Elbi',
  dialogs: {
    login: {
      id: 'login',
    },
    help: {
      id: 'help',
      label: 'Help',
      pattern: 'Utilities.Help',
    },
    orders: {
      id: 'orders',
      label: 'Orders',
      pattern: 'GetOrders',
      entities: {
        number: 'Orders.Number',
        open: 'Orders.Status::Open',
        failed: 'Orders.Status::Failed',
      },
    },
  },
  orderStatuses: {
    New: 0,
    Submitted: 100,
    'Ready to Acknowledge': 150,
    'Ready to Ship': 500,
    'Ready to Invoice': 600,
    Complete: 1000,
    Cancelled: 1100,
    Failed: 1200,
    Ignored: 1400,
  },
};
