// help dialog
module.exports = (session) => {
  session.send('Some commands you can ask me...');
  const commands = [
    'Show me open orders from two months ago',
    'Get cancelled orders from the past year',
    'Retrieve open orders from March 2, 2017 to April 2, 2018',
    'Give me line items from order 000000020',
    'Get information for order 000000051',
    'Billing address of order 000000053',
    'Shipping address of order 000000053',
    'Fetch orders with status 1000',
    'Status of order TEST0027',
    'Update the status of order 000000053 to Complete',
  ];
  session.send(commands.join('\n\n'));
  session.endDialog();
};
