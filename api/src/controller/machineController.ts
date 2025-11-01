import type { RequestHandler } from 'express';
import { Op } from 'sequelize';

import { Machine } from '../models/modelMachine.js';
import { MachineType } from '../models/modelMachineType.js';
import { requestError } from '../utils/requrestError.js';

import type { TypeGetById } from '../schema/defaults.js';
import type { TypeAddMachineSchema, TypeModifyMachineSchema } from '../schema/machineSchema.js';
import type { TypedRequestHandler } from '../types/api.js';

const NOT_FOUND = 'Машина не знайдена';

const getAll: TypedRequestHandler = async ({ query: { deleted } }, res) => {
  const items = await Machine.findAll({ paranoid: deleted === undefined });
  res.json({ items: items.map((m) => m.dataValues), count: items.length });
};

const get: TypedRequestHandler<TypeGetById> = async ({ params: { id }, query: { deleted } }, res, next) => {
  const machine = await Machine.findByPk(id, { paranoid: deleted === undefined });
  if (!machine) {
    return next(requestError(404, NOT_FOUND));
  }

  res.json(machine.dataValues);
};

const add: TypedRequestHandler<TypeAddMachineSchema> = async (
  { body: { licensePlate, make, model, description, type } },
  res
) => {
  const savedMachine = (
    await Machine.findOrCreate({ where: { licensePlate }, defaults: { licensePlate, make, model, description, type } })
  )[0];

  res.json(savedMachine.dataValues);
};

const modify: TypedRequestHandler<TypeModifyMachineSchema> = async (
  { body: { id, licensePlate, make, model, description, type } },
  res,
  next
) => {
  const machine = await Machine.findAll({ where: { [Op.or]: [{ id }, { description }] } });
  if (!machine || machine.length === 0 || machine[0].id !== id) {
    return next(requestError(404, NOT_FOUND));
  } else if (machine.length > 1) {
    return next(requestError(400, 'Така машина вже існує'));
  }

  if (!(await MachineType.findByPk(type))) {
    return next(requestError(404, 'Такого типу не існує'));
  }

  const foundMachine = machine[0];
  foundMachine.update({ licensePlate, make, model, description, type });

  res.json(foundMachine.dataValues);
};

const remove: RequestHandler = async ({ body: { id } }, res, next) => {
  const machine = await Machine.findByPk(id);
  if (!machine) {
    return next(requestError(404, NOT_FOUND));
  }

  await machine.destroy();
  res.status(209).json(machine.dataValues).send();
};

export const machineController = {
  getAll,
  get,
  add,
  modify,
  remove,
};
