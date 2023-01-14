require('dotenv').config();
const { MONGODB_HOST, PORT } = require('./config');
const { allConstants } = require('./utils');

async function connectMongoose() {
  const mongoose = require('mongoose');

  if (!MONGODB_HOST) throw new Error('MONGODB_HOST not defined!');

  await mongoose.connect(MONGODB_HOST);
  console.log(`Connected to MongoDB`);
}

function connectMail() {
  const { mailInterface } = require('./utils');

  mailInterface.verify();
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
