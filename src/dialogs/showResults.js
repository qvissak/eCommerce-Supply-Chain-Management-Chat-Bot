const builder = require('botbuilder');
const createCards = require('./helpers/cards');
const orderAPIHelper = require('./helpers/orders');
const { statusInt2Str, dialogs } = require('../utils/constants');

const displayOrderResponse = (session, resp, statusStr) => {
  const status = statusStr.toDialogString().toLowerCase();

  if (resp && resp.length > 0) {
    // TODO: Find out which channels do not support cards
    const menuData = orderAPIHelper.getMenuData(resp, statusInt2Str);
    createCards.heroCards(session, menuData);
  } else {
    session.send(`There are no ${status} orders at this time.`);
  }
};

var payload;
var statusStr;

module.exports = [
  (session, arg) => {
    payload = arg.payload;
    statusStr = arg.statusStr;
    if(payload.length == 0)
      session.endDialog("I couldn't get the results, I'm sorry.");
    var dispRecords = payload.Records.splice(0,10);
    displayOrderResponse(session, dispRecords, statusStr);
    if(payload.Records.length > 0){
      builder.Prompts.choice(session, 
        `There are ${payload.Records.length} results left to show. Would you like to see the next 10?`, 
        'Yes|No', { listStyle: 3 }
      );
    } else{
      session.endDialog("That's all I found.");
    }
  },
  (session, results) => {
    if (results.response.entity === 'Yes') {
      session.send("Ok! I'll show you more.");
      session.replaceDialog(
        dialogs.showResults.id,
        { payload: payload, statusStr: statusStr }
      );
    } else {
      session.endDialog("Ok, I won't show anymore.");
    }
  },
];
