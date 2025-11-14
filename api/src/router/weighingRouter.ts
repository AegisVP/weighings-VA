import { Router } from 'express';
import { weighingController } from '../controller/weighingController.js';
import { validateBody } from '../middlewares/validation.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';
import { addWeighingSchema } from '../schema/weighingSchema.js';

export const weighingRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Weighings
 *   description: Weighing management endpoints
 */

/**
 * @openapi
 * /api/weighings:
 *   post:
 *     tags: [Weighings]
 *     summary: Add a new weighing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketNo
 *               - firstWeight
 *               - secondWeight
 *               - machineId
 *               - operatorId
 *               - cropId
 *               - locationFromId
 *               - locationToId
 *             properties:
 *               ticketNo:
 *                 type: string
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *               firstWeight:
 *                 type: number
 *               secondWeight:
 *                 type: number
 *               machineId:
 *                 type: string
 *                 format: uuid
 *               operatorId:
 *                 type: string
 *                 format: uuid
 *               cropId:
 *                 type: string
 *                 format: uuid
 *               locationFromId:
 *                 type: string
 *                 format: uuid
 *               locationToId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Weighing created successfully
 */
weighingRouter.post('/', validateBody(addWeighingSchema), tryCatchWrapper(weighingController.add));

/**
 * @openapi
 * /api/weighings:
 *   get:
 *     tags: [Weighings]
 *     summary: Search weighings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for search range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for search range
 *       - in: query
 *         name: machineId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by machine ID
 *       - in: query
 *         name: operatorId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by operator ID
 *       - in: query
 *         name: cropId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by crop ID
 *       - in: query
 *         name: locationFromId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by source location ID
 *       - in: query
 *         name: locationToId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by destination location ID
 *     responses:
 *       200:
 *         description: List of weighings matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   dateTime:
 *                     type: string
 *                     format: date-time
 *                   netWeight:
 *                     type: number
 *                   deliveryMachineId:
 *                     type: string
 *                     format: uuid
 *                   deliveryOperatorId:
 *                     type: string
 *                     format: uuid
 *                   harvesterMachineId:
 *                     type: string
 *                     format: uuid
 *                   harvesterOperatorId:
 *                     type: string
 *                     format: uuid
 *                   cropId:
 *                     type: string
 *                     format: uuid
 *                   locationFromId:
 *                     type: string
 *                     format: uuid
 *                   locationToId:
 *                     type: string
 *                     format: uuid
 */
weighingRouter.get('/', tryCatchWrapper(weighingController.search));
