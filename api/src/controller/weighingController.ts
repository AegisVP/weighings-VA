import { Op } from 'sequelize';
import { CROSS_ENV, ENVIRONMENT_CLOUD } from '../config/constants.js';
import { requestError } from '../utils/requrestError.js';
import { Weighing } from '../models/modelWeighing.js';
import { Location } from '../models/modelLocation.js';
import { Machine } from '../models/modelMachine.js';
import { Operator } from '../models/modelOperator.js';
import { Crop } from '../models/modelCrop.js';

import type { TypeGetById } from '../schema/defaults.js';
import type { TypeAddWeighingSchema, TypeSearchWeighingQuery } from '../schema/weighingSchema.js';
import type { TypedRequestHandler } from '../types/api.js';

const get: TypedRequestHandler<TypeGetById> = async ({ params: { id } }, res, next) => {
  const weighing = await Weighing.findByPk(id);
  if (!weighing) return next(requestError(404, 'Зважування не знайдене'));

  res.json(weighing.dataValues);
};

const add: TypedRequestHandler<TypeAddWeighingSchema, any, any> = async (req, res, next) => {
  if (CROSS_ENV === ENVIRONMENT_CLOUD) {
    return next(requestError(403, 'Додавання зважувань заборонено в хмарній версії'));
  }

  const { source, destination, auto, driver, harvester, operator, crop, weight } = req.body;
  const newWeighing = new Weighing();

  if (!(await Location.findOne({ where: { id: source, isSource: true } }))) {
    return next(requestError(400, 'Джерело задане невірно'));
  }

  if (!(await Location.findOne({ where: { id: destination, isDestination: true } }))) {
    return next(requestError(400, 'Призначення задане невірно'));
  }

  if (!(await Machine.findOne({ where: { id: auto, canDeliver: true } }))) {
    return next(requestError(400, 'Машина задана невірно'));
  }

  if (!(await Operator.findOne({ where: { id: driver } }))) {
    return next(requestError(400, 'Водій заданий невірно'));
  }

  if (!(await Machine.findOne({ where: { id: harvester, canHarvest: true } }))) {
    return next(requestError(400, 'Комбайн заданий невірно'));
  }

  if (!(await Operator.findOne({ where: { id: operator } }))) {
    return next(requestError(400, 'Комбайнер заданий невірно'));
  }

  if (!(await Crop.findOne({ where: { id: crop } }))) {
    return next(requestError(400, 'Культура задана невірно'));
  }

  await newWeighing.update({
    source,
    destination,
    auto,
    driver,
    harvester,
    operator,
    crop,
    weight,
    createdBy: req.user?.id,
  });

  res.json(newWeighing.dataValues);
};

const search: TypedRequestHandler<any, TypeSearchWeighingQuery, any> = async (req, res, _next) => {
  const {
    startDate,
    endDate,
    deliveryMachineId,
    deliveryOperatorId,
    harvesterMachineId,
    harvesterOperatorId,
    cropId,
    sourceId,
    destinationId,
  } = req.query;

  let searchStartDate = new Date();
  let searchEndDate = new Date();

  searchStartDate.setHours(0, 0, 0, 0);
  searchEndDate.setHours(23, 59, 59, 999);

  if (startDate) {
    searchStartDate = new Date(startDate);
  }

  if (endDate) {
    searchEndDate = new Date(endDate);
  }

  const items = await Weighing.findAll({
    where: {
      createdAt: {
        [Op.between]: [searchStartDate, searchEndDate],
      },
      ...(deliveryMachineId && { deliveryMachineId }),
      ...(deliveryOperatorId && { deliveryOperatorId }),
      ...(harvesterMachineId && { harvesterMachineId }),
      ...(harvesterOperatorId && { harvesterOperatorId }),
      ...(cropId && { cropId }),
      ...(sourceId && { sourceId }),
      ...(destinationId && { destinationId }),
    },
  });

  res.json({ items: items.map((m) => m.dataValues), count: items.length });
};

export const weighingController = { get, add, search };
