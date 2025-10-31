import { Router } from 'express';
import { machineController } from '../controller/machineController.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validation.js';
import { getByIdSchema, getDeletedQuerySchema } from '../schema/defaults.js';
import { addMachineSchema, modifyMachineSchema } from '../schema/machineSchema.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';

export const machineRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Machines
 *   description: Machine management endpoints
 */

/**
 * @openapi
 * /api/machines:
 *   get:
 *     tags: [Machines]
 *     summary: Get all machines
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/deletedQuery'
 *     responses:
 *       200:
 *         description: Machine list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Machine'
 */
machineRouter.get('/', validateQuery(getDeletedQuerySchema), tryCatchWrapper(machineController.getAll));

/**
 * @openapi
 * /api/machines/{id}:
 *   get:
 *     tags: [Machines]
 *     summary: Get machine by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: deleted
 *         schema:
 *           type: boolean
 *         description: Include deleted machines
 *     responses:
 *       200:
 *         description: Machine details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Machine'
 *       404:
 *         description: Machine not found
 */
machineRouter.get(
  '/:id',
  validateParams(getByIdSchema),
  validateQuery(getDeletedQuerySchema),
  tryCatchWrapper(machineController.get)
);

/**
 * @openapi
 * /api/machines:
 *   post:
 *     tags: [Machines]
 *     summary: Add a new machine
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licensePlate
 *               - type
 *             properties:
 *               licensePlate:
 *                 type: string
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Machine details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Machine'
 */
machineRouter.post('/', validateBody(addMachineSchema), tryCatchWrapper(machineController.add));

/**
 * @openapi
 * /api/machines:
 *   patch:
 *     tags: [Machines]
 *     summary: Modify an existing machine
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               licensePlate:
 *                 type: string
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Machine details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Machine'
 *       400:
 *         description: Machine already exists
 *       404:
 *         description: Machine or machine type not found
 */
machineRouter.patch('/', validateBody(modifyMachineSchema), tryCatchWrapper(machineController.modify));

/**
 * @openapi
 * /api/machines:
 *   delete:
 *     tags: [Machines]
 *     summary: Delete a machine
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       209:
 *         description: Machine deleted successfully
 *       404:
 *         description: Machine not found
 */
machineRouter.delete('/', validateBody(getByIdSchema), tryCatchWrapper(machineController.remove));
