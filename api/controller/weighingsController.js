const {
  requestError,
  allConstants,
  getDbEntryId: { getSubscriptionsIdByName },
} = require('../utils');
const { Weighings } = require('../model');

const getWeighings = async (req, res, next) => {
  //
  // TODO:
  // implement searches by
  // - date
  // - end date (for date range)
  // - driver
  // - source
  // - destination
  // - type of crop
  // - isIncoming
  // - by harvester
  //

  if (req.user.subscription === getSubscriptionsIdByName('basic')) return next(requestError(401, 'Not authorized', 'NotQualified'));

  const searchParams = {};
  const { source, driver, date } = req.query;
  let { year, month, day } = req.query;

  if (!year || !month || !day) {
    const parseDate = new Date(date || Date.now());
    [year, month, day] = [parseDate.getFullYear(), parseDate.getMonth() + 1, parseDate.getDate()];
  }

  year = parseInt(year);
  month = parseInt(month);
  day = parseInt(day);

  searchParams.date = { year, month, day };
  if (source) searchParams['crop.source'] = source;
  if (driver) searchParams['auto.driver'] = driver;
  // if (source) searchParams['crop.source'] = source;
  // if (source) searchParams['crop.source'] = source;

  const weighings = await Weighings.find(searchParams);

  res.json(weighings);
};

const addWeighing = async (req, res, next) => {
  //
  // TODO:
  // - implement "isHarvested"
  //

  const warnings = [];
  const weighingRecord = req.body;

  if (String(req.user.subscription) !== String(getSubscriptionsIdByName('weighing'))) return next(requestError(401, 'Not authorized', 'NotQualified'));

  if (!allConstants.autosList.map(i => String(i._id)).includes(weighingRecord.auto.id)) return next(requestError(400, 'Invalid auto ID', 'NoSuchAuto'));
  if (!allConstants.driversList.map(i => String(i._id)).includes(weighingRecord.auto.driver)) return next(requestError(400, 'Invalid driver ID', 'NoSuchDriver'));
  if (!allConstants.cropsList.map(i => String(i._id)).includes(weighingRecord.crop.id)) return next(requestError(400, 'Invalid crop ID', 'NoSuchCrop'));
  if (!allConstants.sourcesList.map(i => String(i._id)).includes(weighingRecord.crop.source)) return next(requestError(400, 'Invalid crop source', 'NoSuchSource'));
  if (!allConstants.destinationsList.map(i => String(i._id)).includes(weighingRecord.crop.destination))
    return next(requestError(400, 'Invalid crop destination', 'NoSuchDestination'));

  const { weighing, crop, harvesters } = weighingRecord;
  const { brutto, tare, netto } = weighing;
  const newNetto = parseInt(brutto) - parseInt(tare);
  const harvestersCount = harvesters.length;

  if (netto !== newNetto) {
    warnings.push('weighing.netto replaced with calculated value');
    weighingRecord.weighing = { ...weighingRecord.weighing, netto: newNetto };
  }

  if (harvestersCount > 0 && allConstants.sourcesList.find(i => String(i._id) === crop.source)?.harvested) {
    const nettoForEachHarvester = newNetto / harvestersCount;
    const harvestersClone = [];
    let totalWeight = 0;

    for (const harvester of harvesters) {
      if (!allConstants.harvestersList.map(i => String(i._id)).includes(harvester.id)) return next(requestError(400, `Invalid harvester id ${harvester.id}`, 'NoSuchHarvester'));

      totalWeight += parseInt(harvester.weight);
      harvestersClone.push({ id, weight: nettoForEachHarvester });
    }

    if (totalWeight !== newNetto) {
      warnings.push('harvesters.weight replaced with calculated value');
      weighingRecord.harvesters = harvestersClone;
    }
  }

  weighingRecord.createdBy = req.user.email;

  const result = await Weighings.create(weighingRecord);

  return res.json({ ...(warnings.length && { warnings }), result });
};

module.exports = {
  getWeighings,
  addWeighing,
};
