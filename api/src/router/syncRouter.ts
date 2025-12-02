import { Router } from 'express';
import { triggerSync, getSyncStatus, stopSync, startSync } from '../controller/syncController.js';

export const syncRouter = Router();

/**
 * @openapi
 * tags:
 *   name: Sync
 *   description: Remote database synchronization endpoints
 */

/**
 * @openapi
 * /api/sync/status:
 *   get:
 *     tags: [Sync]
 *     summary: Get synchronization status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sync status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: object
 *                   properties:
 *                     enabled:
 *                       type: boolean
 *                       description: Whether sync is enabled
 *                     isRunning:
 *                       type: boolean
 *                       description: Whether sync runner is active
 *                     isSyncing:
 *                       type: boolean
 *                       description: Whether sync is currently in progress
 *                     lastSyncTime:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       description: Timestamp of last sync attempt
 *                     lastSyncStatus:
 *                       type: string
 *                       enum: [success, failed, pending]
 *                       description: Result of last sync attempt
 *                     lastSyncError:
 *                       type: string
 *                       nullable: true
 *                       description: Error message from last failed sync
 *                     consecutiveFailures:
 *                       type: integer
 *                       description: Number of consecutive failed sync attempts
 *                     nextCheckIn:
 *                       type: integer
 *                       nullable: true
 *                       description: Seconds until next scheduled sync check
 *                     remoteDbConfigured:
 *                       type: boolean
 *                       description: Whether remote database is configured
 */
syncRouter.get('/status', getSyncStatus);

/**
 * @openapi
 * /api/sync/start:
 *   post:
 *     tags: [Sync]
 *     summary: Trigger manual synchronization
 *     description: Manually start synchronization with remote database
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sync triggered successfully
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
 *                   example: Synchronization completed successfully
 *                 triggered:
 *                   type: boolean
 *                   description: Whether sync was actually triggered
 *                 recordsSynced:
 *                   type: integer
 *                   description: Number of records synchronized
 *       400:
 *         description: Sync not enabled or already in progress
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
 *                   example: Synchronization is disabled
 *       500:
 *         description: Sync failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
syncRouter.post('/start', triggerSync);

/**
 * @openapi
 * /api/sync/disable:
 *   post:
 *     tags: [Sync]
 *     summary: Stop synchronization runner
 *     description: Stops the background synchronization runner. This will cancel any scheduled sync operations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Command accepted and is processing
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
 *                   example: Command accepted. Check status for current state
 *       500:
 *         description: Failed to stop sync runner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
syncRouter.post('/disable', stopSync);

/**
 * @openapi
 * /api/sync/enable:
 *   post:
 *     tags: [Sync]
 *     summary: Start synchronization runner
 *     description: Starts the background synchronization runner. This will enable scheduled automatic sync operations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Command accepted and is processing
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
 *                   example: Command accepted. Check status for current state
 *       500:
 *         description: Failed to start sync runner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
syncRouter.post('/enable', startSync);
