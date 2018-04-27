const builder = require('botbuilder');
const createCards = require('./helpers/cards');
const orderAPIHelper = require('./helpers/orders');
const { statusInt2Str, dialogs } = require('../utils/constants');

const displayOrderResponse = (session, resp) => {
  if (resp && resp.length > 0) {
    // TODO: Find out which channels do not support cards
    const menuData = orderAPIHelper.getMenuData(resp, statusInt2Str);
    createCards.heroCards(session, menuData);
  }
};

let payload;
let statusStr;

module.exports = [
  (session, arg) => {
    ({ payload, statusStr } = arg);
    if (payload.length === 0) {
      session.endDialog("I couldn't get the results, I'm sorry. Try asking me to look at a smaller timeframe.");
    }
    const dispRecords = payload.Records.splice(0, 10);
    displayOrderResponse(session, dispRecords);
    if (payload.Records.length > 1) {
      builder.Prompts.choice(
        session,
        `There are ${payload.Records.length} results left to show. Would you like to see more?`,
        'Yes|No', { listStyle: 3 },
      );
    } else if (payload.Records.length === 1) {
      builder.Prompts.choice(
        session,
        `There is ${payload.Records.length} result left to show. Would you like to see it?`,
        'Yes|No', { listStyle: 3 },
      );
    } else {
      session.endDialog("That's all I found.");
    }
  },
  (session, results) => {
    if (results.response.entity === 'Yes') {
      session.send('Okay!');
      session.replaceDialog(
        dialogs.showResults.id,
        { payload, statusStr },
      );
    } else {
      session.endDialog('No problem! How else can I help today?');
    }
  },
];
