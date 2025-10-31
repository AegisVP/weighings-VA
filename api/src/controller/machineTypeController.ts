import type { RequestHandler } from 'express';
import { Op } from 'sequelize';

import { MachineType } from '../models/modelMachineType.js';
import { requestError } from '../utils/requrestError.js';

import type { TypeGetById } from '../schema/defaults.js';
import type { TypeAddMachineTypeSchema, TypeModifyMachineTypeSchema } from '../schema/machineTypeSchema.js';
import type { TypedRequestHandler } from '../types/api.js';

const NOT_FOUND = 'Тип не знайдений';

const getAll: TypedRequestHandler = async ({ query: { deleted } }, res) => {
  const items = await MachineType.findAll({ paranoid: deleted === undefined });
  res.json({ items: items.map((t) => t.dataValues), count: items.length });
};

const get: TypedRequestHandler<TypeGetById> = async ({ params: { id }, query: { deleted } }, res, next) => {
  const machineType = await MachineType.findByPk(id, { paranoid: deleted === undefined });
  if (!machineType) {
    return next(requestError(404, NOT_FOUND));
  }

  res.json(machineType.dataValues);
};

const add: TypedRequestHandler<TypeAddMachineTypeSchema> = async ({ body: { name } }, res) => {
  const newMachineType = (await MachineType.findOrCreate({ where: { name }, defaults: { name } }))[0];

  res.json(newMachineType.dataValues);
};

const modify: TypedRequestHandler<TypeModifyMachineTypeSchema> = async ({ body: { id, name } }, res, next) => {
  const machineType = await MachineType.findAll({ where: { [Op.or]: [{ id }, { name }] } });
  if (!machineType || machineType.length === 0 || machineType[0].id !== id) {
    return next(requestError(404, NOT_FOUND));
  } else if (machineType.length > 1) {
    return next(requestError(400, 'Такий тип вже існує'));
  }

  const foundMachineType = machineType[0];
  foundMachineType.update({ name });

  res.json(foundMachineType.dataValues);
};

const remove: RequestHandler = async ({ body: { id } }, res, next) => {
  const machineType = await MachineType.findByPk(id);
  if (!machineType) {
    return next(requestError(404, NOT_FOUND));
  }

  await machineType.destroy();
  res.status(209).json(machineType.dataValues).send();
};

export const machineTypeController = {
  getAll,
  get,
  add,
  modify,
  remove,
};
