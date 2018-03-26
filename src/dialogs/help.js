// help dialog
module.exports = function (session) {
  session.send('Some commands you can ask me...');
  session.send('Show me open orders from two months ago\n\n' +
    'Show me order XYZ123\n\nBilling address of order ABC321\n\n' +
    'Update the status of order XYZ123 to Completed');
  session.endDialog();
};
