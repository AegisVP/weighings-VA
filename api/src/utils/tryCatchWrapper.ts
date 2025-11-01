import type { RequestHandler } from 'express';

export const tryCatchWrapper =
  (fn: RequestHandler): RequestHandler =>
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
