require('dotenv').config();
const { MONGODB_HOST, PORT } = require('./config');
const { allConstants } = require('./utils');

async function connectMongoose() {
  try {
    const mongoose = require('mongoose');

    if (!MONGODB_HOST) throw new Error('MONGODB_HOST not defined!');

    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_HOST);

    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.error('Connection to MongoDB failed!');
    console.error('Error:', err);
    process.exit(2);
  }
}

function connectMail() {
  const { mailInterface } = require('./utils');

  if (mailInterface.verify()) {
    console.log('SendGrid configuration loaded');
  } else {
    console.error('SendGrid configuration failed!');
    process.exit(3);
  }
}

async function main() {
  try {
    allConstants.updateAll();
    connectMail();
    connectMongoose();

    const { app } = require('./app');

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
