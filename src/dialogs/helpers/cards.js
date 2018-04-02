const builder = require('botbuilder');

class CreateCards {
  static heroCards(session, menuData) {
    const msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    const attachments = [];
    menuData.forEach((orderInfo) => {
      attachments.push(new builder.ThumbnailCard(session)
        .title(orderInfo.orderNumber)
        .subtitle(orderInfo.orderDate)
        .text(orderInfo.status)
        .buttons([
          builder.CardAction.imBack(session, `Get information for order ${orderInfo.orderNumber}`, 'Get Information'),
        ]));
    });
    msg.attachments(attachments);
    session.send(msg);
  }
}

module.exports = CreateCards;
