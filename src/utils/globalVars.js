class GlobalVars {
  static init() {
    global.Promise = require('bluebird');
    global._ = require('lodash');
    global.request = require('../apis/helpers/request');
    global.logicBroker = require('../apis/logicBroker');
  }
}

module.exports = GlobalVars;
