const allConstants = require('./allConstants');

const getAutosIdByName = query => allConstants.autosList.find(item => item.auto === query)?._id;
const getAutosIdByLicensePlate = query => allConstants.autosList.find(item => item.licensePlate === query)?._id;
const getCropsIdByName = query => allConstants.cropsList.find(item => item.crop === query)?._id;
const getDestinationsIdByName = query => allConstants.destinationsList.find(item => item.destination === query)?._id;
const getDriversIdByName = query => allConstants.driversList.find(item => item.driver === query)?._id;
const getHarvestersIdByName = query => allConstants.harvestersList.find(item => item.harvester === query)?._id;
const getSourcesIdByName = query => allConstants.soucesList.find(item => item.source === query)?._id;
const getSubscriptionsIdByName = query => allConstants.subscriptionsList.find(item => item.subscription === query)?._id;

module.exports = {
  getAutosIdByName,
  getAutosIdByLicensePlate,
  getCropsIdByName,
  getDestinationsIdByName,
  getDriversIdByName,
  getHarvestersIdByName,
  getSourcesIdByName,
  getSubscriptionsIdByName,
};
