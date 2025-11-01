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
    decodedUser.username = decodedUser.username.toLocaleLowerCase();
  } catch (_) {
    return next(requestError(401, NOT_AUTHORIZED_MSG, 'TokenVerifyFailed'));
  }
  if (!decodedUser || !decodedUser.id || !decodedUser.username || !decodedUser.name)
    return next(requestError(401, NOT_AUTHORIZED_MSG, 'TokenInvalid'));

  const dbUser = await User.findByPk(decodedUser.id);
  if (!dbUser) return next(requestError(401, NOT_AUTHORIZED_MSG, 'NoTokenUser'));
  dbUser.username = dbUser.username.toLocaleLowerCase();
  if (dbUser.username !== `${decodedUser.username}`.toLocaleLowerCase())
    return next(requestError(401, NOT_AUTHORIZED_MSG, 'TokenUsernameMismatch'));

  if (dbUser.token !== token) {
    await dbUser.update({ token: null, refreshToken: null });

    // TODO: Add refresh token check and token reissue logic here

    return next(requestError(401, NOT_AUTHORIZED_MSG, 'TokenMismatch'));
  }

  req.user = dbUser;

  return next();
};
