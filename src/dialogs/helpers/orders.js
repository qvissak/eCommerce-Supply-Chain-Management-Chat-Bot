const _ = require('lodash');
const moment = require('moment');
const { rawStatus2DialogStatus } = require('../../utils/constants');

/**
 * Get a human-readable string for the billing address of the given order
 * @param order
 * @returns {string}
 */
const getOrderBillingAddress = (order) => {
  let str = '';
  if (order && order.BillToAddress) {
    const address = order.BillToAddress || '';
    const name = address.CompanyName || '';
    const street = address.Address1 || '';
    const city = address.City || '';
    const state = address.State || '';
    const zip = address.Zip || '';
    str = `${name}\n\n${street}\n\n${city}, ${state} ${zip}`;
  }
  return str;
};

/**
 * Get a human-readable string for the shipping address of the given order
 * @param order
 * @returns {string}
 */
const getOrderShippingAddress = (order) => {
  let str = '';
  if (order && order.ShipToAddress) {
    const address = order.ShipToAddress || '';
    const name = address.CompanyName || '';
    const street = address.Address1 || '';
    const city = address.City || '';
    const state = address.State || '';
    const zip = address.Zip || '';
    str = `${name}\n\n${street}\n\n${city}, ${state} ${zip}`;
  }
  return str;
};

/**
 * Get a list of human-readable strings for each line item of the given order
 * Each string in the list gives info about the line item's SKU, quantity, and description
 * @param order
 * @returns {[string]}
 */
const getOrderLineItems = (order) => {
  const lineItems = [];
  if (order && order.OrderLines) {
    let i = 1;
    order.OrderLines.forEach((lineItem) => {
      let str = `Item ${i}`;
      i += 1;
      if (lineItem.Description) str = `${str}\n\n${lineItem.Description}`;
      if (lineItem.Quantity) str = `${str}\n\nQuantity: ${lineItem.Quantity}`;
      if (lineItem.ItemIdentifier) {
        str = `${str}\n\nSupplier SKU: ${lineItem.ItemIdentifier.SupplierSKU}`;
        str = `${str}\n\nPartner SKU: ${lineItem.ItemIdentifier.PartnerSKU}`;
      }
      lineItems.push(str);
    });
  }
  return lineItems;
};

/**
 * Filter all orders response by order number or some identifier
 * @param {Object[]} records
 * @param {String} identifier (can be OrderNumber, SourceKey, LogicbrokerKey, or LinkKey)
 * @returns {Object} object containing order information given order number, or null if not found
 */
const getOrderByIdentifier = (records, identifier) => {
  const ident = identifier.toString().toLowerCase();
  const foundOrder = _.find(records, o =>
    o.OrderNumber.toString().toLowerCase() === ident ||
    o.Identifier.SourceKey.toString().toLowerCase() === identifier ||
    o.Identifier.LogicbrokerKey.toString().toLowerCase() === identifier ||
    o.Identifier.LinkKey.toString().toLowerCase() === identifier);
  return foundOrder;
};

/**
 * Filter all orders response by status code
 * @param {Object[]} records
 * @param number statusCode
 * @returns {Object[]} objects which have the given status code
 */
const filterOrdersByStatus = (records, statusCode) =>
  _.filter(records, { StatusCode: statusCode });

/**
 * Get all orders with status code less than 1000
 * @param {Object[]} records
 * @returns {Object[]} objects which have the given status code
 */
const getOpenOrders = records =>
  _.filter(records, o => o.StatusCode < 1000);

/**
 * Maps orders response to object of identifiers
 * @param {Object[]} records
 * @returns {Object[]} list of identifier objects
 */
const getIdentifiers = records => records.map(record => record.Identifier);

/**
 * Get status description by status code
 * @param {Object} statuses
 * @param {Number} statusCode
 * @returns {String} status description
 */
const getStatusByCode = (statuses, statusCode) =>
  _.find(statuses, { DocumentType: 'Order', StatusId: statusCode }).StatusDescription;


/**
 * Get info for orders menu for bot
 * @param {Object[]} records
 * @param {Object} statuses
 * @returns {Object[]}
 */
const getMenuData = (records, statuses) => records.map(record => ({
  identifier: record.Identifier,
  orderNumber: record.OrderNumber,
  orderDate: moment(record.OrderDate).format('MMMM Do, YYYY'),
  status: getStatusByCode(statuses, record.StatusCode),
}));

/**
 * Get status display string for dialog
 * @param {String} rawStatus
 * @returns {String} status
*/
const toDialogString = String.prototype.toDialogString = function () {
  return _.get(rawStatus2DialogStatus, this);
};

module.exports = {
  getOrderBillingAddress,
  getOrderShippingAddress,
  getOrderLineItems,
  getOrderByIdentifier,
  filterOrdersByStatus,
  getOpenOrders,
  getIdentifiers,
  getMenuData,
  getStatusByCode,
  toDialogString,
};
