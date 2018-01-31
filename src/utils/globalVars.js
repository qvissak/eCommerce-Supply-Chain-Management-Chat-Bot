class GlobalVars {
  static init() {
    global.Promise = require('bluebird');
    global._ = require('lodash');
  }
}

module.exports = GlobalVars;
