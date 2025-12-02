import { syncRunner } from '../sync/syncRunner.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';
import { SYNC_ENABLED } from '../config/constants.js';
import type { Response } from 'express';

export const triggerSync = tryCatchWrapper(async (_, res: Response) => {
  if (!SYNC_ENABLED) {
    return res.status(400).json({
      success: false,
      message: 'Synchronization is disabled',
    });
  }

  const result = await syncRunner.triggerManualSync();

  return res.status(200).json({
    success: true,
    ...result,
  });
});

export const stopSync = tryCatchWrapper(async (_, res: Response) => {
  await syncRunner.stop();

  return res.status(202).json({
    success: true,
    message: 'Command accepted. Check status for current state.',
  });
});

export const startSync = tryCatchWrapper(async (_, res: Response) => {
  await syncRunner.start();

  return res.status(202).json({
    success: true,
    message: 'Command accepted. Check status for current state.',
  });
});

export const getSyncStatus = tryCatchWrapper(async (_, res: Response) => {
  const status = syncRunner.getStatus();

  return res.status(200).json({
    success: true,
    status,
  });
});
