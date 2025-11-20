import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.js';
import { User } from '../models/index.js';
import { requestError } from '../utils/requrestError.js';

export type TypeJwtPayload = {
  id: string;
  name: string;
  username: string;
};

const NOT_AUTHORIZED_MSG = 'Не авторизовано';

export const authService: RequestHandler = async (req, _, next) => {
  if (!req.headers.authorization) return next(requestError(401, NOT_AUTHORIZED_MSG, 'NoAuthHeader'));

  const [authScheme, token] = req.headers.authorization.split(' ');
  if (authScheme !== 'Bearer') return next(requestError(401, NOT_AUTHORIZED_MSG, 'UnsupportedAuth'));
  if (!token) return next(requestError(401, NOT_AUTHORIZED_MSG, 'NoToken'));

  let decodedUser: TypeJwtPayload | null = null;
  try {
    decodedUser = jwt.verify(token, JWT_SECRET) as TypeJwtPayload;
    decodedUser.username = decodedUser.username.toLowerCase();
  } catch (_) {
    return next(requestError(401, NOT_AUTHORIZED_MSG, 'TokenVerifyFailed'));
  }
  if (!decodedUser || !decodedUser.id || !decodedUser.username || !decodedUser.name)
    return next(requestError(401, NOT_AUTHORIZED_MSG, 'TokenInvalid'));

  const dbUser = await User.findByPk(decodedUser.id);
  if (!dbUser) return next(requestError(401, NOT_AUTHORIZED_MSG, 'NoTokenUser'));
  dbUser.username = dbUser.username.toLowerCase();
  if (dbUser.username !== `${decodedUser.username}`.toLowerCase()) {
    return next(requestError(401, NOT_AUTHORIZED_MSG, 'TokenUsernameMismatch'));
  }

  if (dbUser.token !== token) {
    await dbUser.update({ token: null, refreshToken: null });

    // TODO: Add refresh token check and token reissue logic here

    return next(requestError(401, NOT_AUTHORIZED_MSG, 'TokenMismatch'));
  }

  const validFeatures = dbUser.features
    .filter((f) => f.enabled)
    .filter((f) => f.UserHasFeature.expires === null || f.UserHasFeature.expires > new Date());

  req.user = {
    ...dbUser.get(),
    features: validFeatures,
  };

  return next();
};
