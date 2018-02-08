const acknowledgement = require('./acknowledgement/index');
const inventory = require('./inventory/index');
const invoice = require('./invoice/index');
const order = require('./order/index');
const product = require('./product/index');
const shipment = require('./shipment/index');
const status = require('./status/index');

module.exports = {
  acknowledgement,
  inventory,
  invoice,
  order,
  product,
  shipment,
  status,
};
