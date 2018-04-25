const responses = require('./helpers/dialog');
const _ = require('lodash');

// Private generic randomized response function
const getGenericResponse = response => _.sample(response);

const yesLogoutResponse = () => getGenericResponse(responses.yeslogoutDialog);
const notLogoutResponse = () => getGenericResponse(responses.notlogoutDialog);
const helpInquiry = () => getGenericResponse(responses.helpInquiryDialog);
const keyAuthResponse = () => getGenericResponse(responses.keyAuthDialog);
const waitingResponse = () => getGenericResponse(responses.waitingDialog);
const insultResponse = () => getGenericResponse(responses.meanDialog);
const niceResponse = () => getGenericResponse(responses.niceDialog);
const confusedResponse = () =>
  getGenericResponse(responses.confusedDialog) + getGenericResponse(responses.conQuestionDialog);
const errorResponse = () => getGenericResponse(responses.errorDialog);
const helpResponse = () =>
  getGenericResponse(responses.helpDialogPart1) + getGenericResponse(responses.helpDialogPart2);

module.exports = {
  yesLogoutResponse,
  notLogoutResponse,
  helpInquiry,
  keyAuthResponse,
  waitingResponse,
  insultResponse,
  niceResponse,
  confusedResponse,
  errorResponse,
  helpResponse,
};
