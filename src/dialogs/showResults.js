const builder = require('botbuilder');
const apiStore = require('../apis/apiStore');
const createCards = require('./helpers/cards');
const { logger } = require('../utils/logger');
const orderAPIHelper = require('./helpers/orders');
const { entities, statusStr2Int, statusInt2Str, dialogs } = require('../utils/constants');

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

module.exports = [
     (session, arg) => {
     	  session.dialogData.payload = arg.payload;
     	  session.dialogData.statusStr = arg.statusStr;
     	  displayOrderResponse(session, session.dialogData.payload.Records, session.dialogData.statusStr);
          builder.Prompts.choice(session, `Would you like to see more?`, `Yes|No`, { listStyle: 3 });
      },
      (session, results) => {
          if(results.response.entity === `Yes`){
          	session.send(`Ok! I'll show you more.`);
            session.replaceDialog(dialogs.showResults.id, {payload: session.dialogData.payload, statusStr: session.dialogData.statusStr});
          }
          else{
            session.endDialog(`Ok, I won't show anymore.`)
          }
      },
];