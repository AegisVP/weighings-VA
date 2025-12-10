import type { RequestHandler } from 'express';
import { Op } from 'sequelize';

import { Crop } from '../models/modelCrop.js';
import { requestError } from '../utils/requrestError.js';

import type { TypeGetById } from '../schema/defaults.js';
import type { TypeAddCropSchema, TypeModifyCropSchema } from '../schema/cropSchema.js';
import type { TypedRequestHandler } from '../types/api.js';

const NOT_FOUND = 'Культура не знайдена';

const getAll: TypedRequestHandler = async ({ query: { deleted } }, res) => {
  const items = await Crop.findAll({ paranoid: deleted === undefined, order: [['name', 'ASC']] });
  res.json({ items: items.map((c) => c.dataValues), count: items.length });
};

const get: TypedRequestHandler<TypeGetById> = async ({ params: { id }, query: { deleted } }, res, next) => {
  const crop = await Crop.findByPk(id, { paranoid: deleted === undefined });
  if (!crop) {
    return next(requestError(404, NOT_FOUND));
  }

  res.json(crop.dataValues);
};

const add: TypedRequestHandler<TypeAddCropSchema> = async ({ body: { name } }, res) => {
  const newCrop = (await Crop.findOrCreate({ where: { name }, defaults: { name } }))[0];

  res.json(newCrop.dataValues);
};

const modify: TypedRequestHandler<TypeModifyCropSchema> = async ({ body: { id, name } }, res, next) => {
  const crop = await Crop.findAll({ where: { [Op.or]: [{ id }, { name }] } });
  if (!crop || crop.length === 0 || crop[0].id !== id) {
    return next(requestError(404, NOT_FOUND));
  } else if (crop.length > 1) {
    return next(requestError(400, 'Така культура вже існує'));
  }

  const foundCrop = crop[0];
  foundCrop.update({ name });

  res.json(foundCrop.dataValues);
};

const remove: RequestHandler = async ({ body: { id } }, res, next) => {
  const crop = await Crop.findByPk(id);
  if (!crop) {
    return next(requestError(404, NOT_FOUND));
  }

  await crop.destroy();
  res.status(209).json(crop.dataValues).send();
};

export const cropController = { getAll, get, add, modify, remove };
