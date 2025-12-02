import { faker } from '@faker-js/faker';
import { Machine } from '../models/modelMachine.js';
import { Operator } from '../models/modelOperator.js';
import { Location } from '../models/modelLocation.js';
import { Crop } from '../models/modelCrop.js';
import { Weighing } from '../models/modelWeighing.js';
import { User } from '../models/index.js';

export const generateRandomWeighings = async (count: number = 100) => {
  const machines = await Machine.findAll();
  const operators = await Operator.findAll();
  const locations = await Location.findAll();
  const crops = await Crop.findAll();
  const me = await User.findOne({ where: { username: 'vladp' } });

  const weighings = [];

  for (let i = 0; i < count; i++) {
    const deliveryMachine = faker.helpers.arrayElement(machines.filter((m) => m.canDeliver));
    const harvesterMachine = faker.helpers.arrayElement(machines.filter((m) => m.canHarvest));
    const deliveryOperator = faker.helpers.arrayElement(operators);
    const harvesterOperator = faker.helpers.arrayElement(operators);
    const sourceLocation = faker.helpers.arrayElement(locations.filter((l) => l.isSource));
    const destinationLocation = faker.helpers.arrayElement(locations.filter((l) => l.isDestination));
    const crop = faker.helpers.arrayElement(crops);
    const weightNetto = faker.number.int({ min: 300, max: 1500 }) * 10;
    const dateTime = faker.date.between({ from: '2025-09-01T00:00:00.000Z', to: new Date() });

    const weighing = new Weighing({
      source: sourceLocation.id,
      destination: destinationLocation.id,
      auto: deliveryMachine.id,
      driver: deliveryOperator.id,
      harvester: harvesterMachine.id,
      operator: harvesterOperator.id,
      crop: crop.id,
      weight: weightNetto,
      createdAt: dateTime,
      updatedAt: dateTime,
      createdBy: me?.id,
    });

    weighings.push(weighing);
  }

  return weighings;
};
