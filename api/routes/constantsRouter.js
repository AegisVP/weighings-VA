const constantsRouter = require('express').Router();

const { constantsController } = require('../controller');
const { tryCatchWrapper } = require('../utils');

constantsRouter.get('/:reqConstant', tryCatchWrapper(constantsController.getConstants));

module.exports = constantsRouter;
