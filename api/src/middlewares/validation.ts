import type { RequestHandler } from 'express';
import { z } from 'zod';
import { requestError } from '../utils/requrestError.js';

const validate = (val: 'body' | 'params' | 'query', schema: z.ZodSchema) => {
  const func: RequestHandler = async (req, _, next) => {
    const { error } = schema.safeParse(req[val]);
    return next(error ? requestError(400, z.prettifyError(error), 'ValidationError') : undefined);
  };

  return func;
};

export const validateBody = (schema: z.ZodSchema) => validate('body', schema);
export const validateParams = (schema: z.ZodSchema) => validate('params', schema);
export const validateQuery = (schema: z.ZodSchema) => validate('query', schema);
