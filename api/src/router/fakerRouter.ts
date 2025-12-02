import { Router } from 'express';
import { generateFakeData } from '../controller/fakerController.js';

export const fakerRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Faker
 *   description: Test data generation endpoints (development only)
 */

/**
 * @openapi
 * /api/faker/generate:
 *   post:
 *     tags: [Faker]
 *     summary: Generate fake weighing data
 *     description: Generate random weighing records for testing. Only works in development environment.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               count:
 *                 type: integer
 *                 default: 100
 *                 minimum: 1
 *                 maximum: 10000
 *                 description: Number of fake weighing records to generate
 *               force:
 *                 type: boolean
 *                 default: false
 *                 description: Force generation even if data already exists
 *     responses:
 *       200:
 *         description: Fake data generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Fake data generated successfully
 *                 generated:
 *                   type: integer
 *                   description: Number of records generated
 *                 totalRecords:
 *                   type: integer
 *                   description: Total number of weighing records in database
 *       400:
 *         description: Data already exists (use force=true to override)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 existingCount:
 *                   type: integer
 *       403:
 *         description: Not allowed in production environment (use force=true to override)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Fake data generation is only allowed in development environment
 */
fakerRouter.post('/generate', generateFakeData);
