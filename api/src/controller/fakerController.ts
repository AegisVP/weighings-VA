import type { Request, Response } from 'express';
import { generateRandomWeighings } from '../db/faker.js';
import { Weighing } from '../models/index.js';
import { tryCatchWrapper } from '../utils/tryCatchWrapper.js';
import { CROSS_ENV, ENVIRONMENT_DEV } from '../config/constants.js';

export const generateFakeData = tryCatchWrapper(async (req: Request, res: Response) => {
  const { count = 100, force = false } = req.body;

  if (CROSS_ENV !== ENVIRONMENT_DEV && !force) {
    return res.status(403).json({
      success: false,
      message: 'Fake data generation is only allowed in development environment. Use force=true to override.',
    });
  }

  const existingCount = await Weighing.count();
  if (existingCount > 0 && !force) {
    return res.status(400).json({
      success: false,
      message: `Database already contains ${existingCount} weighings. Use force=true to generate anyway.`,
      existingCount,
    });
  }

  console.log(`[Faker] Generating ${count} fake weighings...`);
  const weighings = await generateRandomWeighings(count);

  await Weighing.bulkCreate(weighings.map((w) => w.dataValues));

  const totalCount = await Weighing.count();

  console.log(`[Faker] Successfully generated ${weighings.length} fake weighings`);

  return res.status(200).json({
    success: true,
    message: 'Fake data generated successfully',
    generated: weighings.length,
    totalRecords: totalCount,
  });
});
