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

    const allConstantsCursor = client.db('VAgro').collection('constants');
    const allConstants = await allConstantsCursor.find().toArray();

    const allAutosCursor = client.db('VAgro').collection('autos');
    this.autosList = await allAutosCursor.find().toArray();

    this.assignValues(allConstants);
    console.log('All constants fetched from DB');

    // //////////////////////  watch for updates  ////////////////////////////////////

    const options = { fullDocument: 'updateLookup' };
    const constantsStream = allConstantsCursor.watch([], options);
    const autosStream = allAutosCursor.watch([], options);

    constantsStream.on('change', change => {
      this.assignOneValue(change.fullDocument);
      console.log(`Updated constant "${change.fullDocument.type}" from DB`);
    });

    autosStream.on('change', change => {
      this.allAutos = this.allAutos.map(auto => {
        if (String(auto._id) === String(change.fullDocument._id)) {
          console.log(`Updated "${change.fullDocument.model}" in "autos" from DB`);
          return change.fullDocument;
        } else {
          return auto;
        }
      });
    });
  }

  assignValues(allConstants) {
    for (const oneConstant of allConstants) {
      this[`${oneConstant.type}List`] = oneConstant.data;
    }
  }

  assignOneValue(constant) {
    if (Array.isArray(constant)) return this.assignValues(constant);

    this[`${constant.type}List`] = constant.data;
  }
}

const allConstants = new DbConstants();

module.exports = allConstants;
