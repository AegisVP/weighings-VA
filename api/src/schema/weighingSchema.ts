import { z } from 'zod';

export const addWeighingSchema = z.strictObject({
  source: z.uuid('Вкажіть джерело'),
  destination: z.uuid('Вкажіть призначення'),
  auto: z.uuid('Вкажіть автомобіль'),
  driver: z.uuid('Вкажіть водія'),
  harvester: z.uuid('Вкажіть комбайн'),
  operator: z.uuid('Вкажіть оператора'),
  crop: z.uuid('Вкажіть культуру'),
  weight: z.number('Вкажіть вагу'),
  createdBy: z.string('Вкажіть хто створив запис'),
});
export type TypeAddWeighingSchema = z.infer<typeof addWeighingSchema>;

export const searchWeighingQuerySchema = z.strictObject({
  sourceId: z.uuid().optional(),
  destinationId: z.uuid().optional(),
  deliveryMachineId: z.uuid().optional(),
  deliveryOperatorId: z.uuid().optional(),
  harvesterMachineId: z.uuid().optional(),
  harvesterOperatorId: z.uuid().optional(),
  cropId: z.uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export type TypeSearchWeighingQuery = z.infer<typeof searchWeighingQuerySchema>;
