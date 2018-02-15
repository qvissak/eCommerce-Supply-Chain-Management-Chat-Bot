const _ = require('lodash');
const moment = require('moment');

/**
 * Filter all orders response by order number
 * @param {Object[]} records
 * @param {String} orderNumber
 * @returns {Object} object containing order information given order number
 */
const getOrderByNumber = (records, orderNumber) =>
  _.find(records, o => o.OrderNumber === orderNumber);

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


module.exports = {
  getOrderByNumber,
  getIdentifiers,
  getMenuData,
  getStatusByCode,
};
