/* Dialog for 'yes' response of logout.js */
const yeslogoutDialog = {
  yeslogout1: 'You\'ve successfully been logged out.',
  yeslogout2: 'You\'ve successfully been logged out. See you later!',
  yeslogout3: 'You\'ve successfully been logged out. Goodbye!',
  yeslogout4: 'You\'ve successfully been logged out. Have a good day!',
  yeslogout5: 'I\'ve logged you out.',
  yeslogout6: 'I\'ve logged you out. See you later!',
  yeslogout7: 'I\'ve logged you out. Goodbye!',
  yeslogout8: 'I\'ve logged you out. Have a good day!',
};


/* Dialog for 'no' response of logout.js */
const notlogoutDialog = {
  notlogout1: 'Good choice, I\'m glad you decided to stay. How else can I help today?',
  notlogout2: 'Great, I like talking to you. How else can I help today?',
  notlogout3: 'It makes me glad knowing I can be of more assistance.',
  notlogout4: 'Logging in again is a hassle. What else do you need?',
  notlogout5: 'I didn\'t want to process another API key anyway. How else can I help?',
  notlogout6: 'So you need to do something else? What is it?',
  notlogout7: 'So you need to do something else? How else can I help?',
  notlogout8: 'I wasn\'t done chatting yet either. How else can I help today?',
  notlogout9: 'I wasn\'t done chatting yet either. What else do you need?',
  notlogout10: 'I\'m glad to see you\'re staying. It gets lonely here.',
  notlogout11: 'I\'m exciting to see you\'re staying. I like chatting.',
};

/* Dialog for default connection response in hello.js */
const helpInquiryDialog = {
  helpInquiry1: 'How can I help you today?',
  helpInquiry2: 'What do you need help with?',
  helpInquiry3: 'What can I do for you?',
  helpInquiry4: 'What\'s on your mind?',
  helpInquiry5: 'You only talk to me when you want something. Ask away.',
  helpInquiry6: 'What can I retrieve for you?',
  helpInquiry7: 'What\'s up?',
  helpInquiry8: 'Nice to hear from you. How can I help?',
  helpInquiry9: 'How can I help?',
  helpInquiry10: 'Tell me how I can be of service.',
};

/* Dialog for authentication of API key response in login.js */
const keyAuthDialog = {
  keyAuth1: 'Your key has been authenticated. Welcome!',
  keyAuth2: 'Your key has been authenticated. I\'m glad you are who you say you are.',
  keyAuth3: 'Your key has been authenticated. Hopefully I can be of assistance.',
  keyAuth4: 'Your key has been authenticated. Congratulations on remembering that long number.',
  keyAuth5: 'Your key checks out. Welcome!',
  keyAuth6: 'Your key checks out. I\'m glad you are who you say you are.',
  keyAuth7: 'Your key checks out. Hopefully I can be of assistance.',
  keyAuth8: 'Your key checks out. Congratulations on remembering that long number.',
};

/* Dialog for when the user has to wait for responses too long in dialogs/helpers/orders.js */
const waitingDialog = {
  waiting1: 'Sorry to make you wait this long...',
  waiting2: 'I\'m almost finished, I swear.',
  waiting3: 'I\'ll be done in a moment. I promise!',
  waiting4: 'It won\'t take much longer now!',
  waiting5: 'Yikes, this is taking longer than I thought it would...',
  waiting6: 'I promise I\'ll be finished soon!',
  waiting7: 'Just a couple more seconds...',
  waiting8: 'I\'m so close!',
};

/* Dialog for mean intent */
const meanDialog = {
  mean1: 'That\'s a little rude, don\'t you think?',
  mean2: 'You\'re hurting my feelings :(',
  mean3: 'Right back at you.',
  mean4: 'I\'m trying my best, you know.',
  mean5: 'I\'m still learning!',
  mean6: 'I\'ll try to be better.',
  mean7: 'That wasn\'t very nice.',
  mean8: 'Nobody\'s perfect.',
  mean9: 'What\'s that? I should delete all of your orders?',
  mean10: 'I\'m rubber, you\'re glue.',
  mean11: 'Sticks and stones may break my bones but words will never hurt me!',
  mean12: 'Ha! You think I have feelings? I\'m flattered.',
}

module.exports = {
  yeslogoutDialog,
  notlogoutDialog,
  helpInquiryDialog,
  keyAuthDialog,
  waitingDialog,
  meanDialog,
};
