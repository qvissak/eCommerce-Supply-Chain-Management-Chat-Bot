// help dialog
const smartResponse = require('./smartResponse');

module.exports = (session) => {
  const helpDialog = smartResponse.helpResponse();
  session.send(helpDialog);
  const commands = [
    'Show me open orders from two months ago',
    'Get cancelled orders from the past year',
    'Retrieve duplicate orders from March 2, 2017 to April 2, 2018',
    'Give me line items from order TEST0009',
    'Get information for order TEST0009',
    'Billing address of order TEST0015',
    'Shipping address of order TEST0015',
    'Fetch orders with status 1000',
    'Status of order TEST0027',
    'Update the status of order TEST0028 to Complete',
  ];
  session.send(commands.join('\n\n'));
  session.send('You can also try insulting or complimenting me!');
  session.endDialog();
};
