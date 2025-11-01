import type { NextFunction, Request, Response } from 'express';
import type * as core from 'express-serve-static-core';

export type TypeGeneralBody = Record<string, string | number | unknown>;

export type TypedRequestHandler<
  ReqBody = TypeGeneralBody | null | undefined,
  ReqQuery = core.Query,
  Params = core.ParamsDictionary,
  ResBody = TypeGeneralBody | null | undefined,
> = (req: Request<Params, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => void | Promise<void> | NextFunction;
