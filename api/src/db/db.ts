import { Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from '../config/constants.js';
import type { Options } from 'sequelize';

const sequelizeDBOptions: Options = {
  dialect: 'postgres',
  logging: false,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  dialectOptions: { ssl: false },
};

export const sequelize = new Sequelize(sequelizeDBOptions);

export const verifySequelize = new Promise((resolve, reject) => {
  sequelize
    .authenticate()
    .then(() => {
      resolve('Database connection established');
    })
    .catch((e) => {
      console.error('Unable to connect to the database:', e);
      reject(new Error('Database connection failed!'));
    });
});
