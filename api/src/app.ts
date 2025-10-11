import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { CROSS_ENV, ENVIRONMENT_DEV } from './config/constants.ts';
import { healthCheck } from './controller/healthCheck.ts';

export const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/health', healthCheck);
app.use(morgan(CROSS_ENV === ENVIRONMENT_DEV ? 'dev' : 'short'));
