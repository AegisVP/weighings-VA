const usersRouter = require('express').Router();
const { validationBody, authService } = require('../middlewares');
const { userJoiSchemas } = require('../schemas');
const { usersController } = require('../controller');
const { tryCatchWrapper } = require('../utils');

usersRouter.post('/signup', validationBody(userJoiSchemas.addSchema), tryCatchWrapper(usersController.registerUser));
usersRouter.post('/login', validationBody(userJoiSchemas.loginSchema), tryCatchWrapper(usersController.loginUser));
usersRouter.post('/verify', validationBody(userJoiSchemas.verifyEmailSchema), tryCatchWrapper(usersController.resendVerificationEmail));
usersRouter.get('/verify/:verificationToken', tryCatchWrapper(usersController.verifyUserEmail));
usersRouter.patch('/', tryCatchWrapper(authService), validationBody(userJoiSchemas.subscriptionSchema), tryCatchWrapper(usersController.updateSubscription));
usersRouter.post('/logout', tryCatchWrapper(authService), tryCatchWrapper(usersController.logoutUser));
usersRouter.get('/current', tryCatchWrapper(authService), tryCatchWrapper(usersController.currentUser));

module.exports = usersRouter;
