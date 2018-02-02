const getOrders = (status = '') => new Promise(async (resolve) => {
  try {
    // Using v1 since v2 raises Internal Server Error
    const orderRes = await (status ? request.get('v1/Orders', { status }) : request.get('v1/Orders'));
    resolve(orderRes.Body);
  } catch (e) {
    resolve(e);
  }
});

const getReadyOrders = () => new Promise(async (resolve) => {
  try {
    const orderRes = await request.get('v2/Orders/Ready');
    resolve(orderRes);
  } catch (e) {
    resolve(e);
  }
});

module.exports = {
  getOrders,
  getReadyOrders,
};
