class GlobalVars {
  static init() {
    global.Promise = require('bluebird');
    global._ = require('lodash');
    global.request = require('request-promise');
    global.logicBroker = require('../apis/logicBroker');
    global.Dialog = require('../utils/constants.js');
  }
}

module.exports = GlobalVars;
