/* eslint quotes: 0 */

/* Dialog for "yes" response of logout.js */
const yeslogoutDialog = {
  yeslogout1: "You've successfully been logged out.",
  yeslogout2: "You've successfully been logged out. See you later!",
  yeslogout3: "You've successfully been logged out. Goodbye!",
  yeslogout4: "You've successfully been logged out. Have a good day!",
  yeslogout5: "I've logged you out.",
  yeslogout6: "I've logged you out. See you later!",
  yeslogout7: "I've logged you out. Goodbye!",
  yeslogout8: "I've logged you out. Have a good day!",
};


/* Dialog for "no" response of logout.js */
const notlogoutDialog = {
  notlogout1: "Good choice, I'm glad you decided to stay. How else can I help today?",
  notlogout2: "Great, I like talking to you. How else can I help today?",
  notlogout3: "It makes me glad knowing I can be of more assistance.",
  notlogout4: "Logging in again is a hassle. What else do you need?",
  notlogout5: "I didn't want to process another API key anyway. How else can I help?",
  notlogout6: "So you need to do something else? What is it?",
  notlogout7: "So you need to do something else? How else can I help?",
  notlogout8: "I wasn't done chatting yet either. How else can I help today?",
  notlogout9: "I wasn't done chatting yet either. What else do you need?",
  notlogout10: "I'm glad to see you're staying. It gets lonely here.",
  notlogout11: "I'm exciting to see you're staying. I like chatting.",
};

/* Dialog for default connection response in hello.js */
const helpInquiryDialog = {
  helpInquiry1: "How can I help you today?",
  helpInquiry2: "What do you need help with?",
  helpInquiry3: "What can I do for you?",
  helpInquiry4: "What's on your mind?",
  helpInquiry5: "You only talk to me when you want something. Ask away.",
  helpInquiry6: "What can I retrieve for you?",
  helpInquiry7: "What's up?",
  helpInquiry8: "Nice to hear from you. How can I help?",
  helpInquiry9: "How can I help?",
  helpInquiry10: "Tell me how I can be of service.",
};

/* Dialog for authentication of API key response in login.js */
const keyAuthDialog = {
  keyAuth1: "Your key has been authenticated. Welcome!",
  keyAuth2: "Your key has been authenticated. I'm glad you are who you say you are.",
  keyAuth3: "Your key has been authenticated. Hopefully I can be of assistance.",
  keyAuth4: "Your key has been authenticated. Congratulations on remembering that long number.",
  keyAuth5: "Your key checks out. Welcome!",
  keyAuth6: "Your key checks out. I'm glad you are who you say you are.",
  keyAuth7: "Your key checks out. Hopefully I can be of assistance.",
  keyAuth8: "Your key checks out. Congratulations on remembering that long number.",
};

/* Dialog for when the user has to wait for responses too long in dialogs/helpers/orders.js */
const waitingDialog = {
  waiting1: "Sorry to make you wait this long...",
  waiting2: "I'm almost finished, I swear.",
  waiting3: "I'll be done in a moment. I promise!",
  waiting4: "It won't take much longer now!",
  waiting5: "Yikes, this is taking longer than I thought it would...",
  waiting6: "I promise I'll be finished soon!",
  waiting7: "Just a couple more seconds...",
  waiting8: "I'm so close!",
};

/* Dialog for mean intent */
const meanDialog = {
  mean1: "That's a little rude, don't you think?",
  mean2: "You're hurting my feelings :(",
  mean3: "Right back at you.",
  mean4: "I'm trying my best, you know.",
  mean5: "I'm still learning!",
  mean6: "I'll try to be better.",
  mean7: "That wasn't very nice.",
  mean8: "Nobody's perfect.",
  mean9: "What's that? I should delete all of your orders?",
  mean10: "I'm rubber, you're glue.",
  mean11: "Sticks and stones may break my bones but words will never hurt me!",
  mean12: "Ha! You think I have feelings? I'm flattered.",
};

/* Dialog for nice intent */
const niceDialog = {
  nice1: "Aw! You're so kind.",
  nice2: "Thank you!",
  nice3: "Aw, that's the nicest thing anyone's ever said to me.",
  nice4: "You are so sweet!",
  nice5: "More people in the world should be as kind as you!",
  nice6: "I appreciate the compliment.",
  nice7: "You're too kind.",
  nice8: "I like being appreciated.",
  nice9: "I don't really have feelings, but thank you.",
  nice10: "Glad to be of assistance!",
};

/* Dialog for generic answers when the bot can't understand an intent */
const confusedDialog = {
  confused1: "I was unable to determine what you need. ",
  confused2: "I'm not quite sure what you're asking me to do. ",
  confused3: "Hmm... I'm not sure what you mean. ",
  confused4: "I'm sorry, but I didn't understand that. ",
  confused5: "I'm afraid I'm not sure what you want. ",
  confused6: "I didn't catch that. ",
  confused7: "I'm not sure what you need. ",
  confused8: "I have to admit, I'm not sure what you're asking. ",
  confused9: "That didn't make sense to me. ",
  confused10: "I couldn't quite make that out. ",
  confused11: "I didn't understand you. ",
  confused12: "I'm still learning, I don't understand. ",
};

/* Randomly combines with the confusedDialog to create a response */
const conQuestionDialog = {
  cq1: "Can you be more specific?",
  cq2: "Could you rephrase that?",
  cq3: "Maybe if you ask another way.",
  cq4: "Maybe if you try a different phrasing, I'll understand better.",
  cq5: "Do you think you could rephrase that?",
  cq6: "If you ask it differently, I'll try again.",
  cq7: "Try asking it a little differently.",
  cq8: "Could you be a tad more specific please?",
  cq9: "If you change your phrasing, I'll give it another shot!",
  cq10: "Try being as specific as possible.",
  cq11: "I'll get it eventually, can you rephrase that?",
  cq12: "Try being more explicit in your question.",
};

/* Dialog for randomizing error responses. Note the usage!! */
const errorDialog = {
  error1: "Uh oh! I ran into a problem while ",
  error2: "Aw man, something went wrong when ",
  error3: "I hate to say it, but I got an error when I tried ",
  error4: "Well, this can't be good... I got an error while ",
  error5: "Something went wrong ",
  error6: "Oops! I ran into a snag while ",
  error7: "Oops! There was a problem ",
  error8: "Aw shoot. I ran into a problem ",
  error9: "Oops... There was an error ",
  error10: "Drat! I encountered an error while ",
};

/* Dialog for when the user requests help */
const helpDialogPart1 = {
  help1: "I can do lots! ",
  help2: "There are lots of things you can ask me. ",
  help3: "I can be super useful! ",
  help4: "Believe it or not, there are lots of things I can do. ",
  help5: "I do my best to be a useful bot! ",
  help6: "I'm well equipped to help you out! ",
  help7: "I'm still learning, but I already have a few tricks up my sleeve. ",
  help8: "I love to answer questions! ",
};

const helpDialogPart2 = {
  help1: "Try any of these:",
  help2: "Ask any of these things:",
  help3: "You can try asking any of these:",
  help4: "Give some of these questions a whirl:",
  help5: "Try out some of these:",
  help6: "Here are some suggestions to try:",
  help7: "If you're looking for ideas, try asking me something like these:",
};

module.exports = {
  yeslogoutDialog,
  notlogoutDialog,
  helpInquiryDialog,
  keyAuthDialog,
  waitingDialog,
  meanDialog,
  niceDialog,
  confusedDialog,
  conQuestionDialog,
  errorDialog,
  helpDialogPart1,
  helpDialogPart2,
};
