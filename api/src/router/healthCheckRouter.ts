import { Router } from 'express';
import { healthCheckController } from '../controller/healthCheckController.js';

/**
 * @openapi
 * tags:
 *   name: System
 *   description: System health and status endpoints
 */

export const healthCheckRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Check API health status
 *     description: Returns health status of the API server
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 */
healthCheckRouter.get('/', healthCheckController);
