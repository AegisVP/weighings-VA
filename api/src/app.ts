import path from 'node:path';
import fs from 'node:fs';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { CROSS_ENV, ENVIRONMENT_DEV } from './config/constants.js';
import { swaggerRouter } from './swagger/swagger.js';
import { authService } from './middlewares/authService.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { userRouter } from './router/userRouter.js';
import { healthCheckRouter } from './router/healthCheckRouter.js';
import { apiRouter } from './router/apiRouter.js';

export const app = express();

const publicPath = path.resolve('../public');
const publicHtmlPath = path.resolve('../public/index.html');

export const pathsExist = new Promise((resolve, reject) => {
  if (fs.existsSync(publicPath) && fs.existsSync(publicHtmlPath)) {
    resolve('Public path exists');
  } else {
    if (CROSS_ENV === ENVIRONMENT_DEV) console.log({ publicHtmlPath, publicPath });
    reject(new Error('Public path does not exist'));
  }
});

app.use(cors());
app.use(express.json());
app.use('/health', healthCheckRouter);
app.use(morgan(CROSS_ENV === ENVIRONMENT_DEV ? 'dev' : 'short'));

app.use('/api-docs', swaggerRouter);

app.use('/api/user', userRouter);

app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

app.use('/api', authService, apiRouter);

app.get('/{*any}', express.static(path.resolve(publicPath)));
app.get('/{*any}', (_, res) => res.sendFile(path.resolve(publicHtmlPath)));

app.use((_, res) => res.status(404).send());

app.use(errorHandler);
