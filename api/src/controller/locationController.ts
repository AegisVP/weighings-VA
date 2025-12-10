import type { RequestHandler } from 'express';
import { Op } from 'sequelize';

import { Location } from '../models/modelLocation.js';
import { requestError } from '../utils/requrestError.js';

import type { TypeGetById } from '../schema/defaults.js';
import type { TypeAddLocationSchema, TypeModifyLocationSchema } from '../schema/locationSchema.js';
import type { TypedRequestHandler } from '../types/api.js';

const NOT_FOUND = 'Локація не знайдена';

const getAll: TypedRequestHandler = async ({ query: { deleted } }, res) => {
  const items = await Location.findAll({ paranoid: deleted === undefined, order: [['name', 'ASC']] });
  res.json({ items: items.map((location) => location.dataValues), count: items.length });
};

const get: TypedRequestHandler<TypeGetById> = async ({ params: { id }, query: { deleted } }, res, next) => {
  const location = await Location.findByPk(id, { paranoid: deleted === undefined });
  if (!location) {
    return next(requestError(404, NOT_FOUND));
  }

  res.json(location.dataValues);
};

const add: TypedRequestHandler<TypeAddLocationSchema> = async ({ body: { name, isSource, isDestination } }, res) => {
  const newLocation = (
    await Location.findOrCreate({ where: { name }, defaults: { name, isSource, isDestination } })
  )[0];

  res.json(newLocation.dataValues);
};

const modify: TypedRequestHandler<TypeModifyLocationSchema> = async (
  { body: { id, name, isSource, isDestination } },
  res,
  next
) => {
  const location = await Location.findAll({ where: { [Op.or]: [{ id }, { name }] } });
  if (!location || location.length === 0 || location[0].id !== id) {
    return next(requestError(404, NOT_FOUND));
  } else if (location.length > 1) {
    return next(requestError(400, 'Така локація вже існує'));
  }

  const foundLocation = location[0];
  foundLocation.update({ name, isSource, isDestination });

  res.json(foundLocation.dataValues);
};

const remove: RequestHandler = async ({ body: { id } }, res, next) => {
  const location = await Location.findByPk(id);
  if (!location) {
    return next(requestError(404, NOT_FOUND));
  }

  await location.destroy();
  res.status(209).json(location.dataValues).send();
};

export const locationController = {
  getAll,
  get,
  add,
  modify,
  remove,
};
