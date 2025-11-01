import { Router } from 'express';
import { userController } from '../controller/userController.js';
import { authService } from '../middlewares/authService.js';
import { validateBody } from '../middlewares/validation.js';
import { userLoginSchema, userRegisterSchema } from '../schema/userSchema.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';

export const userRouter = Router();

/**
 * @openapi
 * tags:
 *   name: User
 *   description: User management and authentication
 */

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     tags: [User]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       409:
 *         description: Username already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Цей логін вже зайнятий
 */
userRouter.post('/register', validateBody(userRegisterSchema), tryCatchWrapper(userController.registerUser));

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     tags: [User]
 *     summary: Log the user in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ім'я та пароль хибні"
 */
userRouter.post('/login', validateBody(userLoginSchema), tryCatchWrapper(userController.loginUser));

/**
 * @openapi
 * /api/user/logout:
 *   post:
 *     tags: [User]
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
userRouter.post('/logout', tryCatchWrapper(authService), tryCatchWrapper(userController.logoutUser));

/**
 * @openapi
 * /api/user/current:
 *   get:
 *     tags: [User]
 *     summary: Get current user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     username:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
userRouter.get('/current', tryCatchWrapper(authService), tryCatchWrapper(userController.currentUser));

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
