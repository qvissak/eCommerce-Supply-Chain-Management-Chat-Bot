const chai = require('chai');

global.expect = chai.expect;
global.assert = chai.assert;
global.Promise = require('bluebird');
global._ = require('lodash');
global.request = require('../src/apis/helpers/request');
global.logicBroker = require('../src/apis/logicBroker');
global.Dialog = require('../src/utils/constants.js');
