import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { CROSS_ENV, ENVIRONMENT_DEV } from './config/constants.ts';
import { healthCheck } from './controller/healthCheck.ts';
import path from 'node:path';

export const app = express();

// Middleware
app.use(cors());
app.get('/health', healthCheck);

app.use(morgan(CROSS_ENV === ENVIRONMENT_DEV ? 'dev' : 'short'));

app.use(express.json());

app.get('/favicon.ico', express.static(path.resolve('../public')));
app.get('/{*any}', express.static('../public'));
app.all('{*any}', (_, res) => res.sendFile(path.resolve('../public/index.html')));
app.use((_, res) => res.status(404).json({ message: 'Not found' }));
