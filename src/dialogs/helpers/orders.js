const _ = require('lodash');
const moment = require('moment');
const { rawStatus2DialogStatus, statusInt2Str } = require('../../utils/constants');
const apiStore = require('../../apis/apiStore');

/**
 * Get a human-readable string which shows a summary of the given order
 * @param order
 * @returns {string}
 */
const getOrderDetails = (order) => {
  let str = '';
  if (order) {
    const ident = order.Identifier.SourceKey ? `${order.Identifier.SourceKey}\n\n` : '';
    const status = order.StatusCode ? `Status: ${statusInt2Str[order.StatusCode]}.\n\n` : '';
    const orderDate = order.OrderDate ? `Order date: ${moment(order.OrderDate).format('MMMM Do, YYYY')}.\n\n` : '';
    let numLineItems = 'Number of line items: 0.';
    if (order.OrderLines) {
      numLineItems = `Number of line items: ${order.OrderLines.length}.`;
    }
    str = `${ident}${status}${orderDate}${numLineItems}`;
  }
  return str;
};

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
 * Filter all orders response by status code
 * @param {Object[]} records
 * @param number statusCode
 * @returns {Object[]} objects which have the given status code
 */
const filterOrdersByStatus = (records, statusCode) =>
  _.filter(records, { StatusCode: statusCode });

/**
 * Get all orders with status code less than 1000
 * @param {Object[]} payload
 * @returns {Object[]} objects which have the given status code
 */
const getOpenOrders = (payload) => {
  const rv = payload;
  const records = rv.Records;
  const openOrders = _.filter(records, o => o.StatusCode < 1000);
  rv.Records = openOrders;
  return rv;
};

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
  status: statuses[record.StatusCode],
}));

/**
 * Get status display string for dialog
 * @param {String} rawStatus
 * @returns {String} status
*/
const toDialogString = String.prototype.toDialogString = function () {
  return _.get(rawStatus2DialogStatus, this);
};

/**
 * Returns the total payload (not records, you need to call the attribute records to get records)
 * @param {Object} session
 * @param {Object} dateTime
 * @param {String or Number} status
 */
const getOrdersByStatus = async (session, dateTime = undefined, status = undefined) => {
  try {
    const from = dateTime ? dateTime.start : dateTime;
    const to = dateTime ? dateTime.end : dateTime;
    let page = 0;
    let response = await apiStore.order.getOrders(from, to, status);
    const totalPages = response.TotalPages;
    const allRecords = response.Records;
    Array(totalPages).fill().forEach(async (el, i) => {
      page = i + 1;
      response = await apiStore.order.getOrders(from, to, status, page);
      allRecords.concat(response.Records);
    });
    response.Records = allRecords;
    return response;
  } catch (e) {
    console.error(e);
    session.send(`${e.error.Message}`);
    return [];
  }
};

module.exports = {
  getOrderDetails,
  getOrderBillingAddress,
  getOrderShippingAddress,
  getOrderLineItems,
  filterOrdersByStatus,
  getOpenOrders,
  getIdentifiers,
  getMenuData,
  getStatusByCode,
  toDialogString,
  getOrdersByStatus,
};
