import { Router } from 'express';
import { machineRouter } from './machineRouter.js';
import { cropRouter } from './cropRouter.js';
import { operatorRouter } from './operatorRouter.js';
import { locationRouter } from './locationRouter.js';
import { weighingRouter } from './weighingRouter.js';

export const apiRouter = Router();

apiRouter.use('/machines', machineRouter);
apiRouter.use('/crops', cropRouter);
apiRouter.use('/operators', operatorRouter);
apiRouter.use('/locations', locationRouter);
apiRouter.use('/weighings', weighingRouter);
