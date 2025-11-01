import 'dotenv/config';
// import dotenv from 'dotenv';
// dotenv.config({ path: '../.env' });

export const ENVIRONMENT_DEV = 'dev';
export const ENVIRONMENT_PROD = 'prod';

export const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
export const DB_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const DB_NAME = process.env.POSTGRES_DB || '';
export const DB_USER = process.env.POSTGRES_USER || '';
export const DB_PASS = process.env.POSTGRES_PASSWORD || '';

export const API_PORT = Number(process.env.API_PORT) || 8080;
export const JWT_SECRET = process.env.JWT_SECRET || 'JWT secret message';
export const CROSS_ENV = process.env.CROSS_ENV || ENVIRONMENT_PROD;

export const MIGRATION_VERSION =
  (CROSS_ENV === ENVIRONMENT_DEV ? Date.now() : Number(process.env.MIGRATION_VERSION)) || 1;
