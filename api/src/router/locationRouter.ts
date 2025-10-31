import { Router } from 'express';
import { locationController } from '../controller/locationController.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validation.js';
import { getByIdSchema, getDeletedQuerySchema } from '../schema/defaults.js';
import { addLocationSchema, modifyLocationSchema } from '../schema/locationSchema.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';

export const locationRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Locations
 *   description: Location management endpoints
 *
 */

/**
 * @openapi
 * /api/locations:
 *   get:
 *     tags: [Locations]
 *     summary: Get all locations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/deletedQuery'
 *     responses:
 *       200:
 *         description: Location details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
locationRouter.get('/', validateQuery(getDeletedQuerySchema), tryCatchWrapper(locationController.getAll));

/**
 * @openapi
 * /api/locations/{id}:
 *   get:
 *     tags: [Locations]
 *     summary: Get location by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - $ref: '#/components/parameters/deletedQuery'
 *     responses:
 *       200:
 *         description: Location details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 */
locationRouter.get(
  '/:id',
  validateParams(getByIdSchema),
  validateQuery(getDeletedQuerySchema),
  tryCatchWrapper(locationController.get)
);

/**
 * @openapi
 * /api/locations:
 *   post:
 *     tags: [Locations]
 *     summary: Add a new location
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
 *             allOf:
 *               - $ref: '#/components/schemas/Location'
 *               - type: object
 *                 properties:
 *                   id:
 *                     readOnly: true
 *     responses:
 *       200:
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 */
locationRouter.post('/', validateBody(addLocationSchema), tryCatchWrapper(locationController.add));

/**
 * @openapi
 * /api/locations:
 *   patch:
 *     tags: [Locations]
 *     summary: Modify an existing location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Location with this name already exists
 *       404:
 *         description: Location not found
 */
locationRouter.patch('/', validateBody(modifyLocationSchema), tryCatchWrapper(locationController.modify));

/**
 * @openapi
 * /api/locations:
 *   delete:
 *     tags: [Locations]
 *     summary: Delete a location
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
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 */
locationRouter.delete('/', validateBody(getByIdSchema), tryCatchWrapper(locationController.remove));
