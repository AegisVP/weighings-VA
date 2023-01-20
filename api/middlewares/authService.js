const jwt = require('jsonwebtoken');
const { User } = require('../model');
const { requestError, allConstants } = require('../utils');
const { JWT_SECRET } = require('../config');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) return next(requestError(401, 'Не авторизовано', 'NoAuthHeader'));

  const [authScheme, token] = req.headers.authorization.split(' ');
  if (authScheme !== 'Bearer') return next(requestError(401, 'Не авторизовано', 'UnsupportedAuth'));
  if (!token) return next(requestError(401, 'Не авторизовано', 'NoToken'));

  let decodedUser = null;
  try {
    decodedUser = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return next(requestError(401, 'Зайдіть знову', 'TokenVerifyFailed'));
  }
  console.log({ decodedUser });
  if (!decodedUser?._id || !decodedUser?.email || !decodedUser?.name || !decodedUser?.subscription) return next(requestError(401, 'Не авторизовано', 'TokenInvalid'));

  const dbUser = await User.findById(decodedUser._id);
  if (!dbUser) return next(requestError(401, 'Не авторизовано', 'NoTokenUser'));
  if (dbUser.name !== decodedUser.name) return next(requestError(401, 'Не авторизовано', 'TokenUserMismatch'));
  if (dbUser.email !== decodedUser.email) return next(requestError(401, 'Не авторизовано', 'TokenEmailMismatch'));
  if (!dbUser.isVerified) return next(requestError(401, 'Account not verified', 'NotVerified'));

  if (dbUser.token !== token) {
    await User.findByIdAndUpdate(dbUser._id, { token: '' });
    return next(requestError(401, 'Не авторизовано', 'TokenMismatch'));
  }

  const { subscriptionsList } = allConstants;

  if (subscriptionsList.indexOf(dbUser.subscription) === -1) {
    dbUser.subscription = subscriptionsList[0];
    await User.findByIdAndUpdate(dbUser._id, { subscription: subscriptionsList[0] });
  }

  req.user = dbUser;

  return next();
};
