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
  createBy: z.uuid('Вкажіть хто створив запис'),
});
export type TypeAddWeighingSchema = z.infer<typeof addWeighingSchema>;

export const searchQuerySchema = z.strictObject({ ...addWeighingSchema.partial().shape });
export type TypeSearchQuery = z.infer<typeof searchQuerySchema>;
