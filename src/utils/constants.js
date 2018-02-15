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
        open: 'Orders.Open',
        failed: 'Orders.Failed',
      },
    },
  },
};
