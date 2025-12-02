import 'dotenv/config';

export const ENVIRONMENT_DEV = 'dev';
export const ENVIRONMENT_CLOUD = 'cloud';
export const ENVIRONMENT_ONSITE = 'onsite';

export const CROSS_ENV = process.env.CROSS_ENV || ENVIRONMENT_ONSITE;

export const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
export const DB_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const DB_NAME = process.env.POSTGRES_DB || '';
export const DB_USER = process.env.POSTGRES_USER || '';
export const DB_PASS = process.env.POSTGRES_PASSWORD || '';

export const REMOTE_DB_HOST = process.env.CLOUD_POSTGRES_HOST || '';
export const REMOTE_DB_PORT = Number(process.env.CLOUD_POSTGRES_PORT) || 5432;
export const REMOTE_DB_NAME = process.env.CLOUD_POSTGRES_DB || '';
export const REMOTE_DB_USER = process.env.CLOUD_POSTGRES_USER || '';
export const REMOTE_DB_PASS = process.env.CLOUD_POSTGRES_PASSWORD || '';

export const SYNC_ENABLED = process.env.SYNC_ENABLED === 'true';
export const API_PORT = Number(process.env.PORT) || 80;
export const JWT_SECRET = process.env.JWT_SECRET || 'JWT secret message';

export const MIGRATION_VERSION =
  (CROSS_ENV === ENVIRONMENT_DEV ? Date.now() : Number(process.env.MIGRATION_VERSION)) || 1;
