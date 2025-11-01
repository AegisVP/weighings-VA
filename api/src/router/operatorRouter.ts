import { Router } from 'express';
import { operatorController } from '../controller/operatorController.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validation.js';
import { getByIdSchema, getDeletedQuerySchema } from '../schema/defaults.js';
import { addOperatorSchema, modifyOperatorSchema } from '../schema/operatorSchema.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';

export const operatorRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Operators
 *   description: Operator management endpoints
 */

/**
 * @openapi
 * /api/operators:
 *   get:
 *     tags: [Operators]
 *     summary: Get all operators
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/deletedQuery'
 *     responses:
 *       200:
 *         description: Operator list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Operator'
 */
operatorRouter.get('/', validateQuery(getDeletedQuerySchema), tryCatchWrapper(operatorController.getAll));

/**
 * @openapi
 * /api/operators/{id}:
 *   get:
 *     tags: [Operators]
 *     summary: Get operator by ID
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
 *         description: Include deleted operators
 *     responses:
 *       200:
 *         description: Operator details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operator'
 *       404:
 *         description: Operator not found
 */
operatorRouter.get(
  '/:id',
  validateParams(getByIdSchema),
  validateQuery(getDeletedQuerySchema),
  tryCatchWrapper(operatorController.get)
);

/**
 * @openapi
 * /api/operators:
 *   post:
 *     tags: [Operators]
 *     summary: Add a new operator
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
 *         description: Operator created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operator'
 */
operatorRouter.post('/', validateBody(addOperatorSchema), tryCatchWrapper(operatorController.add));

/**
 * @openapi
 * /api/operators:
 *   patch:
 *     tags: [Operators]
 *     summary: Modify an existing operator
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
 *         description: Operator details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Operator'
 *       400:
 *         description: Operator with this name already exists
 *       404:
 *         description: Operator not found
 */
operatorRouter.patch('/', validateBody(modifyOperatorSchema), tryCatchWrapper(operatorController.modify));

/**
 * @openapi
 * /api/operators:
 *   delete:
 *     tags: [Operators]
 *     summary: Delete an operator
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
 *         description: Operator deleted successfully
 *       404:
 *         description: Operator not found
 */
operatorRouter.delete('/', validateBody(getByIdSchema), tryCatchWrapper(operatorController.remove));
