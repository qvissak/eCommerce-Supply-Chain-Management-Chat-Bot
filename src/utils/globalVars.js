class GlobalVars {
  static init() {
    global.Promise = require('bluebird');
    global._ = require('lodash');
    global.request = require('request-promise');
    global.logicBroker = require('../apis/logicBroker');
  }
}

module.exports = GlobalVars;
