const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

const { requestError, mailInterface, getDbEntryId } = require('../utils');
const { getSubscriptionsIdByName } = getDbEntryId;
const { User } = require('../model');
const { JWT_SECRET } = require('../config');

const createNewVerificationToken = () => uuid();

async function registerUser(req, res, next) {
  const { name, email } = req.body;
  const verificationToken = createNewVerificationToken();

  if (await User.findOne({ email })) return next(requestError(409, 'Ця пошта вже зареєстрована', 'Conflict'));

  const newUser = new User(req.body);
  newUser.verificationToken = verificationToken;
  await newUser.cryptPassword();
  await newUser.save();

  await mailInterface.sendEmail(mailInterface.generateRegistrationEmail({ name, email, verificationToken }));

  return res.status(201).send();
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(requestError(401, "Ім'я та пароль хибні", 'NoSuchUser'));

  if (!(await bcrypt.compare(password, user.password))) {
    console.log('Entered password hash:', await bcrypt.hash(password, 10));
    return next(requestError(401, "Ім'я та пароль хибні", 'WrongPassword'));
  }

  const { _id, name, subscription = false } = user;

  if (!user.isVerified) return next(requestError(401, 'Очікую підтверждення користувача', 'EmailNotVerified'));

  const token = jwt.sign({ _id, name, email, subscription }, JWT_SECRET);
  await User.findByIdAndUpdate(_id, { token });

  return res.json({ token });
}

async function logoutUser(req, res) {
  await User.findByIdAndUpdate(req.user._id, { token: '' });

  return res.status(204).send();
}

async function currentUser(req, res) {
  const { name, email, subscription } = req.user;
  return res.json({ user: { name, email, subscription } });
}

async function updateSubscription(req, res, next) {
  if (req.user.subscription !== getSubscriptionsIdByName('owner') && req.user.subscription !== getSubscriptionsIdByName('manager'))
    return next(requestError(401, 'Not authorized', 'NotQualified'));
  if (req.user.email === req.body.email) return next(requestError(400, 'Не можна змінювати свій рівень', 'CantUpdateSelf'));

  const updateUser = await User.findOne({ email: req.body.email });
  if (!updateUser) return next(requestError(404, 'Користувача не існує', 'NoUserToUpdate'));

  if (req.user.subscription === getSubscriptionsIdByName('manager')) {
    if (updateUser.subscription === getSubscriptionsIdByName('owner')) return next(requestError(401, 'Not authorized', 'CantModifyOwner'));
    if (req.body.subscription === getSubscriptionsIdByName('owner')) return next(requestError(401, 'Not authorized', 'CantPromoteToOwner'));
  }

  // const { email, subscription } = await User.findOneAndUpdate({ email: req.body.email }, { subscription: req.body.subscription }, { new: true });
  await User.findOneAndUpdate({ email: req.body.email }, { subscription: req.body.subscription });

  return res.status(200).send(); // json({ email, subscription });
}

const verifyUserEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await User.findOneAndUpdate({ verificationToken }, { isVerified: true, verificationToken: '' }, { new: true });
  if (!user) return next(requestError(404, 'User not found', 'NoVerifyToken'));

  mailInterface.sendEmail(mailInterface.generateWelcomeEmail({ email: user.email }));
  return res.status(200).json({ message: 'Verification successful. TODO: redirect to login page' });
  // TODO: redirect to login page
};

const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(requestError(404, 'User not found', 'NoUserFound'));

  const { isVerified, verificationToken } = user;
  if (isVerified) return next(requestError(400, 'Already verified', 'UserIsVerified'));

  mailInterface.sendEmail(mailInterface.generateRegistrationEmail({ email, verificationToken }));
  res.json({ message: 'Verification email sent. TODO: redirect to login page' });
  // TODO: redirect to login page
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscription,
  verifyUserEmail,
  resendVerificationEmail,
};
