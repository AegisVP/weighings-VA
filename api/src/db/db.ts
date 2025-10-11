import { Sequelize } from 'sequelize';

import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } from '../config/constants.ts';

import type { Dialect } from 'sequelize';

const sequelizeDBOptions = {
  dialect: 'mariadb' as Dialect,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

export const sequelize = new Sequelize(sequelizeDBOptions);

export const verifySequelize = new Promise((resolve, reject) => {
  sequelize
    .authenticate()
    .then(() => {
      resolve('MariaDB connection established');
    })
    .catch(() => {
      reject(new Error('MariaDB connection failed!'));
    });
});
