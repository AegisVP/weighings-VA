import type { RequestHandler } from 'express';

export const healthCheckController: RequestHandler = (_, res) => {
  console.info('Health check performed');
  return res.status(200).json({ message: 'OK' });
};
