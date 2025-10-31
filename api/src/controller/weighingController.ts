import { requestError } from '../utils/requrestError.js';
import { Weighing } from '../models/modelWeighing.js';
import { Location } from '../models/modelLocation.js';
import { Machine } from '../models/modelMachine.js';
import { Operator } from '../models/modelOperator.js';
import { Crop } from '../models/modelCrop.js';

import type { TypeGetById } from '../schema/defaults.js';
import type { TypeAddWeighingSchema, TypeSearchQuery } from '../schema/weighingSchema.js';
import type { TypedRequestHandler } from '../types/api.js';

const get: TypedRequestHandler<TypeGetById> = async ({ params: { id } }, res, next) => {
  const weighing = await Weighing.findByPk(id);
  if (!weighing) {
    return next(requestError(404, 'Зважування не знайдене'));
  }

  res.json(weighing.dataValues);
};

const add: TypedRequestHandler<TypeAddWeighingSchema> = async (req, res, next) => {
  const { source, destination, auto, driver, harvester, operator, crop, weight } = req.body;
  const newWeighing = new Weighing();

  if (!(await Location.findOne({ where: { id: source, isSource: true } }))) {
    return next(requestError(404, 'Джерело задане невірно'));
  }

  if (!(await Location.findOne({ where: { id: destination, isDestination: true } }))) {
    return next(requestError(404, 'Призначення задане невірно'));
  }

  if (!(await Machine.findOne({ where: { id: auto } }))) {
    return next(requestError(404, 'Машина задана невірно'));
  }

  if (!(await Operator.findOne({ where: { id: driver } }))) {
    return next(requestError(404, 'Водій заданий невірно'));
  }

  if (!(await Machine.findOne({ where: { id: harvester } }))) {
    return next(requestError(404, 'Комбайн заданий невірно'));
  }

  if (!(await Operator.findOne({ where: { id: operator } }))) {
    return next(requestError(404, 'Комбайнер заданий невірно'));
  }

  if (!(await Crop.findOne({ where: { id: crop } }))) {
    return next(requestError(404, 'Культура задана невірно'));
  }

  newWeighing.update({ source, destination, auto, driver, harvester, operator, crop, weight, createdBy: req.user?.id });
  await newWeighing.save();

  res.json(newWeighing.dataValues);
};

const search: TypedRequestHandler<TypeSearchQuery> = async (req, res, _next) => {
  const { id } = req.query;
  console.log({ id });
  // TODO
  res.json({ message: 'ok' });
};

export const weighingController = { get, add, search };
