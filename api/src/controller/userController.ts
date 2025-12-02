import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { JWT_SECRET, CROSS_ENV, ENVIRONMENT_DEV, ENVIRONMENT_ONSITE } from '../config/constants.js';
import { Feature, User, UserHasFeature } from '../models/index.js';
import { cryptPassword } from '../utils/crypt.js';
import { requestError } from '../utils/requrestError.js';

import type { RequestHandler } from 'express';
import type { TypeUserLoginRequestBody, TypeUserRegisterRequestBody } from '../schema/userSchema.js';
import type { TypedRequestHandler } from '../types/api.js';

const issueToken = ({ id, name, username }: Pick<User, 'id' | 'name' | 'username'>) => {
  const token = jwt.sign({ id, name, username }, JWT_SECRET, {
    expiresIn: 60 * 60 * 8, // 8 hours
  });
  // const refreshToken = jwt.sign({ id, name, username }, JWT_SECRET, {
  //   expiresIn: 60 * 60 * 24 * 7, // 7 days
  // });
  return { token }; // return { token, refreshToken };
};

const registerUser: TypedRequestHandler<TypeUserRegisterRequestBody> = async (req, res, next) => {
  const { username } = req.body;

  if (await User.findOne({ attributes: ['username'], where: { username } })) {
    return next(requestError(409, 'Цей логін вже зайнятий', 'Conflict'));
  }

  const newUser = new User(req.body);
  newUser.username = newUser.username.toLowerCase();
  newUser.password = cryptPassword(newUser.password);

  const { id, name } = newUser;
  const { token } = issueToken({ id, name, username: newUser.username }); // const { token, refreshToken } = issueToken({ id, name, username: newUser.username });
  newUser.token = token;
  newUser.features = []; // newUser.refreshToken = refreshToken;

  const userCount = await User.count();
  await newUser.save();

  // ######### Block for Thesis demostration purposes only #########
  const userFeature = ['ADMIN', 'WEIGHING_ADD', 'DATA_ANALYZE'];
  if ([ENVIRONMENT_DEV, ENVIRONMENT_ONSITE].includes(CROSS_ENV) && userCount < userFeature.length) {
    const addedFeature = await Feature.findOne({ where: { name: userFeature[userCount] } });
    if (addedFeature) {
      await UserHasFeature.create({
        user_id: newUser.id,
        feature_id: addedFeature.id,
      });
      console.log(`Assigned ${userFeature[userCount]} feature to registered user: ${newUser.username}`);
    }
  }

  res.json({ token }); // res.json({ token, refreshToken });
};

const loginUser: TypedRequestHandler<TypeUserLoginRequestBody> = async (req, res, next) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return next(requestError(401, "Ім'я та пароль хибні", 'NoSuchUser'));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(requestError(401, "Ім'я та пароль хибні", 'WrongPassword'));
  }

  const { id, name } = user;

  const { token } = issueToken({ id, name, username }); // const { token, refreshToken } = issueToken({ id, name, username });
  await user.update({ token }); // await user.update({ token, refreshToken });

  res.json({ token }); // res.json({ token, refreshToken });
};

const logoutUser: RequestHandler = async (req, res) => {
  const user = await User.findByPk(req.user?.id);
  user?.update({ token: '' }); // user?.update({ token: '', refreshToken: '' });

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
