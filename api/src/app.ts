import path from 'node:path';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { CROSS_ENV, ENVIRONMENT_DEV } from './config/constants.js';
import { swaggerRouter } from './swagger/swagger.js';
import { authService } from './middlewares/authService.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { machineRouter } from './router/machineRouter.js';
import { userRouter } from './router/userRouter.js';
import { machinetypeRouter } from './router/machineTypeRouter.js';
import { cropRouter } from './router/cropRouter.js';
import { operatorRouter } from './router/operatorRouter.js';
import { locationRouter } from './router/locationRouter.js';
import { weighingRouter } from './router/weighingRouter.js';
import { healthCheckRouter } from './router/healthCheckRouter.js';

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan(CROSS_ENV === ENVIRONMENT_DEV ? 'dev' : 'short'));

app.use('/health', healthCheckRouter);
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

app.use(authService);

app.use('/api/machine-types', machinetypeRouter);
app.use('/api/machines', machineRouter);
app.use('/api/crops', cropRouter);
app.use('/api/operators', operatorRouter);
app.use('/api/locations', locationRouter);
app.use('/api/weighings', weighingRouter);

// app.get('/favicon.ico', express.static(path.resolve('../public')));
app.get('/{*any}', express.static(path.resolve('../public')));
app.all('/', (_, res) => res.sendFile(path.resolve('../public/index.html')));
app.use((_, res) => res.status(404).send());

app.use(errorHandler);
