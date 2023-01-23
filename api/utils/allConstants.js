const { MONGODB_HOST } = require('../config');

class DbConstants {
  constructor() {
    this.autosList = [];
    this.subscriptionsList = [];
    this.driversList = [];
    this.sourcesList = [];
    this.destinationsList = [];
    this.harvestersList = [];
    this.cropsList = [];
  }

  async init() {
    await this.updateAll();
  }

  async updateAll() {
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(MONGODB_HOST, { useNewUrlParser: true });
    await client.connect();

    const autosCursor = client.db('VAgro').collection('autos');
    const cropsCursor = client.db('VAgro').collection('crops');
    const destinationsCursor = client.db('VAgro').collection('destinations');
    const driversCursor = client.db('VAgro').collection('drivers');
    const harvestersCursor = client.db('VAgro').collection('harvesters');
    const sourcesCursor = client.db('VAgro').collection('sources');
    const subscriptionsCursor = client.db('VAgro').collection('subscriptions');

    this.autosList = await autosCursor.find().toArray();
    this.cropsList = await cropsCursor.find().toArray();
    this.destinationsList = await destinationsCursor.find().toArray();
    this.driversList = await driversCursor.find().toArray();
    this.harvestersList = await harvestersCursor.find().toArray();
    this.sourcesList = await sourcesCursor.find().toArray();
    this.subscriptionsList = await subscriptionsCursor.find().toArray();

    console.log('All constants fetched from DB');

    // //////////////////////  watch for updates  ////////////////////////////////////

    const options = { fullDocument: 'updateLookup' };

    const autosStream = autosCursor.watch([], options);
    const cropsStream = cropsCursor.watch([], options);
    const destinationsStream = destinationsCursor.watch([], options);
    const driversStream = driversCursor.watch([], options);
    const harvestersStream = harvestersCursor.watch([], options);
    const sourcesStream = sourcesCursor.watch([], options);
    const subscriptionsStream = subscriptionsCursor.watch([], options);

    autosStream.on('change', change => this.assignOneValue('autos', change.fullDocument));
    cropsStream.on('change', change => this.assignOneValue('crops', change.fullDocument));
    destinationsStream.on('change', change => this.assignOneValue('destinations', change.fullDocument));
    driversStream.on('change', change => this.assignOneValue('drivers', change.fullDocument));
    harvestersStream.on('change', change => this.assignOneValue('harvesters', change.fullDocument));
    sourcesStream.on('change', change => this.assignOneValue('sources', change.fullDocument));
    subscriptionsStream.on('change', change => this.assignOneValue('subscriptions', change.fullDocument));
  }

  assignOneValue(constant, changeDocument) {
    console.log(`Updated "${constant}" entry "${changeDocument[String(constant).slice(0, -1)]}" from DB`);
    this[`${constant}List`] = this[`${constant}List`].map(item => (String(item._id) === String(changeDocument._id) ? changeDocument : item));
  }
}

const allConstants = new DbConstants();

module.exports = allConstants;
