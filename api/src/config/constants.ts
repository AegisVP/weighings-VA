import 'dotenv/config';

export const ENVIRONMENT_DEV = 'dev';
export const ENVIRONMENT_PROD = 'prod';

export const DEFAULT_PORT = 8088;
export const API_PORT = Number(process.env.API_PORT) || DEFAULT_PORT;
export const API_HOST = process.env.API_HOST || `http://127.0.0.1:${API_PORT}`;

export const DB_HOST = process.env.DB_HOST || '127.0.0.1';
export const DB_PORT = Number(process.env.DB_PORT) || 3306;
export const DB_NAME = process.env.DB_NAME || '';
export const DB_USER = process.env.DB_USER || '';
export const DB_PASS = process.env.DB_PASS || '';

export const JWT_SECRET = process.env.JWT_SECRET || 'JWT secret message';
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
export const CROSS_ENV = process.env.CROSS_ENV || ENVIRONMENT_PROD;
