import type { RequestHandler } from 'express';

export const healthCheckController: RequestHandler = (_, res) => {
  return res.status(200).json({ message: 'OK' });
};
