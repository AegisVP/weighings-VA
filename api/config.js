require('dotenv').config();

module.exports = {
  MONGODB_HOST: process.env.MONGODB_HOST,
  PORT: process.env.PORT || 8088,
  API_HOST: process.env.API_HOST || `http://127.0.0.1:${process.env.PORT}`,
  JWT_SECRET: process.env.JWT_SECRET || 'JWT secret message',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  CROSS_ENV: process.env.CROSS_ENV || 'production',
};
