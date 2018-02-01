const getOrders = (status = '') => new Promise(async (resolve) => {
  try {
    const statusQs = status ? `?status=${status}` : status;
    // Using v1 since v2 causes 500 status code
    const orderRes = await request.get(`v1/Orders${statusQs}`);
    resolve(orderRes.Body);
  } catch (e) {
    resolve(e);
  }
});

module.exports = {
  getOrders,
};
