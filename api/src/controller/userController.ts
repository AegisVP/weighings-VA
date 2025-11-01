import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/constants.js';
import { User } from '../models/index.js';
import { cryptPassword } from '../utils/crypt.js';
import { requestError } from '../utils/requrestError.js';

import type { RequestHandler } from 'express';
import type { TypeUserLoginRequestBody, TypeUserRegisterRequestBody } from '../schema/userSchema.js';
import type { TypedRequestHandler } from '../types/api.js';

const issueToken = ({ id, name, username }: Pick<User, 'id' | 'name' | 'username'>) => {
  const token = jwt.sign({ id, name, username }, JWT_SECRET, {
    expiresIn: 60 * 60 * 8, // 8 hours
  });
  const refreshToken = jwt.sign({ id, name, username }, JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  });
  return { token, refreshToken };
};

const registerUser: TypedRequestHandler<TypeUserRegisterRequestBody> = async (req, res, next) => {
  const { username } = req.body;

  if (await User.findOne({ attributes: ['username'], where: { username } })) {
    return next(requestError(409, 'Цей логін вже зайнятий', 'Conflict'));
  }

  const newUser = new User(req.body);
  const { id, name } = newUser;
  const { token, refreshToken } = issueToken({ id, name, username });

  newUser.username = newUser.username.toLocaleLowerCase();
  newUser.password = cryptPassword(newUser.password);
  newUser.token = token;
  newUser.refreshToken = refreshToken;
  await newUser.save();

  res.json({ token, refreshToken });
};

const loginUser: TypedRequestHandler<TypeUserLoginRequestBody> = async (req, res, next) => {
  const username = req.body.username.toLocaleLowerCase();
  const password = req.body.password;
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return next(requestError(401, "Ім'я та пароль хибні", 'NoSuchUser'));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(requestError(401, "Ім'я та пароль хибні", 'WrongPassword'));
  }

  const { id, name } = user;
  const { token, refreshToken } = issueToken({ id, name, username });
  await user.update({ token, refreshToken });

  res.json({ token, refreshToken });
};

const logoutUser: RequestHandler = async (req, res) => {
  const user = await User.findByPk(req.user?.id);
  user?.update({ token: '', refreshToken: '' });

  res.status(204).send();
};

const currentUser: RequestHandler = async (req, res) => {
  const { name, username, features } = req.user ?? {};
  res.json({ user: { name, username, features } });
};

export const userController = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
};
