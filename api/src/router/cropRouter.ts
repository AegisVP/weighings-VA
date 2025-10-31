import { Router } from 'express';
import { cropController } from '../controller/cropController.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validation.js';
import { getByIdSchema, getDeletedQuerySchema } from '../schema/defaults.js';
import { addCropSchema, modifyCropSchema } from '../schema/cropSchema.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';

export const cropRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Crops
 *   description: Crop management endpoints
 */

/**
 * @openapi
 * /api/crops:
 *   get:
 *     tags: [Crops]
 *     summary: Get all crops
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/deletedQuery'
 *     responses:
 *       200:
 *         description: Crop list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Crop'
 */
cropRouter.get('/', validateQuery(getDeletedQuerySchema), tryCatchWrapper(cropController.getAll));

/**
 * @openapi
 * /api/crops/{id}:
 *   get:
 *     tags: [Crops]
 *     summary: Get crop by ID
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
 *         description: Include deleted crops
 *     responses:
 *       200:
 *         description: Crop details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Crop'
 *       404:
 *         description: Crop not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Культура не знайдена
 */
cropRouter.get(
  '/:id',
  validateParams(getByIdSchema),
  validateQuery(getDeletedQuerySchema),
  tryCatchWrapper(cropController.get)
);

/**
 * @openapi
 * /api/crops:
 *   post:
 *     tags: [Crops]
 *     summary: Add a new crop
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
 *         description: Crop details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Crop'
 */
cropRouter.post('/', validateBody(addCropSchema), tryCatchWrapper(cropController.add));

/**
 * @openapi
 * /api/crops:
 *   patch:
 *     tags: [Crops]
 *     summary: Modify an existing crop
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
 *         description: Crop details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Crop'
 *       400:
 *         description: Crop with this name already exists
 *       404:
 *         description: Crop not found
 */
cropRouter.patch('/', validateBody(modifyCropSchema), tryCatchWrapper(cropController.modify));

/**
 * @openapi
 * /api/crops:
 *   delete:
 *     tags: [Crops]
 *     summary: Delete a crop
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
 *         description: Crop deleted successfully
 *       404:
 *         description: Crop not found
 */
cropRouter.delete('/', validateBody(getByIdSchema), tryCatchWrapper(cropController.remove));
