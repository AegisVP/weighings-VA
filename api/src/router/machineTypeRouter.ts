import { Router } from 'express';
import { machineTypeController } from '../controller/machineTypeController.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validation.js';
import { getByIdSchema, getDeletedQuerySchema } from '../schema/defaults.js';
import { addMachineTypeSchema, modifyMachineTypeSchema } from '../schema/machineTypeSchema.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';

export const machinetypeRouter = Router();

/**
 * @openapi
 * tags:
 *   name: MachineTypes
 *   description: Machine type management endpoints
 */

/**
 * @openapi
 * /api/machine-types:
 *   get:
 *     tags: [MachineTypes]
 *     summary: Get all machine types
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/deletedQuery'
 *     responses:
 *       200:
 *         description: Machine type list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MachineType'
 */
machinetypeRouter.get('/', validateQuery(getDeletedQuerySchema), tryCatchWrapper(machineTypeController.getAll));

/**
 * @openapi
 * /api/machine-types/{id}:
 *   get:
 *     tags: [MachineTypes]
 *     summary: Get machine type by ID
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
 *         description: Include deleted machine types
 *     responses:
 *       200:
 *         description: Machine type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineType'
 *       404:
 *         description: Machine type not found
 */
machinetypeRouter.get(
  '/:id',
  validateParams(getByIdSchema),
  validateQuery(getDeletedQuerySchema),
  tryCatchWrapper(machineTypeController.get)
);

/**
 * @openapi
 * /api/machine-types:
 *   post:
 *     tags: [MachineTypes]
 *     summary: Add a new machine type
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Machine type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineType'
 */
machinetypeRouter.post('/', validateBody(addMachineTypeSchema), tryCatchWrapper(machineTypeController.add));

/**
 * @openapi
 * /api/machine-types:
 *   patch:
 *     tags: [MachineTypes]
 *     summary: Modify an existing machine type
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
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Machine type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MachineType'
 *       400:
 *         description: Machine type with this name already exists
 *       404:
 *         description: Machine type not found
 */
machinetypeRouter.patch('/', validateBody(modifyMachineTypeSchema), tryCatchWrapper(machineTypeController.modify));

/**
 * @openapi
 * /api/machine-types:
 *   delete:
 *     tags: [MachineTypes]
 *     summary: Delete a machine type
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
 *         description: Machine type deleted successfully
 *       404:
 *         description: Machine type not found
 */
machinetypeRouter.delete('/', validateBody(getByIdSchema), tryCatchWrapper(machineTypeController.remove));
