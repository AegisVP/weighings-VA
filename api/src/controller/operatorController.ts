import type { RequestHandler } from 'express';
import { Op } from 'sequelize';

import { Operator } from '../models/modelOperator.js';
import { requestError } from '../utils/requrestError.js';

import type { TypeGetById } from '../schema/defaults.js';
import type { TypeAddOperatorSchema, TypeModifyOperatorSchema } from '../schema/operatorSchema.js';
import type { TypedRequestHandler } from '../types/api.js';

const NOT_FOUND = 'Оператор не знайдений';

const getAll: TypedRequestHandler = async ({ query: { deleted } }, res) => {
  const items = await Operator.findAll({ paranoid: deleted === undefined });
  res.json({ items: items.map((o) => o.dataValues), count: items.length });
};

const get: TypedRequestHandler<TypeGetById> = async ({ params: { id }, query: { deleted } }, res, next) => {
  const operator = await Operator.findByPk(id, { paranoid: deleted === undefined });
  if (!operator) {
    return next(requestError(404, NOT_FOUND));
  }

  res.json(operator.dataValues);
};

const add: TypedRequestHandler<TypeAddOperatorSchema> = async ({ body: { name } }, res) => {
  const newOperator = (await Operator.findOrCreate({ where: { name }, defaults: { name } }))[0];

  res.json(newOperator.dataValues);
};

const modify: TypedRequestHandler<TypeModifyOperatorSchema> = async ({ body: { id, name } }, res, next) => {
  const operator = await Operator.findAll({ where: { [Op.or]: [{ id }, { name }] } });
  if (!operator || operator.length === 0 || operator[0].id !== id) {
    return next(requestError(404, NOT_FOUND));
  } else if (operator.length > 1) {
    return next(requestError(400, 'Такий оператор вже існує'));
  }

  const foundOperator = operator[0];
  foundOperator.update({ name });

  res.json(foundOperator.dataValues);
};

const remove: RequestHandler = async ({ body: { id } }, res, next) => {
  const operator = await Operator.findByPk(id);
  if (!operator) {
    return next(requestError(404, NOT_FOUND));
  }

  await operator.destroy();
  res.status(209).json(operator.dataValues).send();
};

export const operatorController = { getAll, get, add, modify, remove };
