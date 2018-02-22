const shipmentUtil = require('../../src/apis/apiStore').shipment;
const moment = require('moment');

const shipmentResHelper = (data) => {
  expect(data).to.exist;
  expect(_.isArray(data)).to.be.true;
};

describe('Shipment Endpoints - LogicBroker API Service', function() {
  describe('getShipments', function() {
    it('No parameters should return all types of shipments', function() {
      return shipmentUtil.getShipments()
        .then((data) => {
          shipmentResHelper(data);
        });
    });
    it('Use of no status code and date parameters should limit results', function() {
      return shipmentUtil.getShipments('','2/11/2018','2/21/2018')
        .then((data) => {
          shipmentResHelper(data);
        });
      });
    it('Use of status code and date parameters should limit results', function() {
      return shipmentUtil.getShipments('1000','2/11/2018','2/21/2018')
        .then((data) => {
          shipmentResHelper(data);
        });
    });
    it('Use of status description and date parameters should limit results', function() {
      return shipmentUtil.getShipments('Complete','2/11/2018','2/21/2018')
        .then((data) => {
          shipmentResHelper(data);
        });
    });
    it('Use of only status description should limit results', function() {
      return shipmentUtil.getShipments('Complete')
        .then((data) => {
          shipmentResHelper(data);
        });
      });
  });
});

describe('Ready Shipment Endpoints - LogicBroker API Service', function() {
    describe('getReadyShipments', function() {
      it('No parameters should return all types of ready shipments', function() {
        return shipmentUtil.getReadyShipments()
          .then((data) => {
            shipmentResHelper(data);
          });
      });
      it('Use of from date only', function() {
        const today = moment().format('MM/DD/YYYY');
        return shipmentUtil.getReadyShipments(today)
          .then((data) => {
            shipmentResHelper(data);
          });
      });
      it('Use of from and to date to get ready orders in all of 2018', function() {
        const today = moment().format('MM/DD/YYYY');
        return shipmentUtil.getReadyShipments('01/01/2018', today)
          .then((data) => {
            shipmentResHelper(data);
          });
      });
    });
  });
