const acknowledgement = require('./acknowledgement');
const inventory = require('./inventory');
const invoice = require('./invoice');
const order = require('./order');
const status = require('./status');
const shipment = require('./shipment');
const product = require('./product');

module.exports = {
  acknowledgement,
  inventory,
  invoice,
  order,
  product,
  status,
  shipment
}
