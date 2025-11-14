import z from 'zod';

export const weighingSchema = z.object({
  deliveryMachine: z.string(),
  deliveryOperator: z.string(),
  harvesterMachine: z.string(),
  harvesterOperator: z.string(),
  sourceLocation: z.string(),
  destinationLocation: z.string(),
  crop: z.string(),
  weightNetto: z.number(),
  dateTime: z.string(), // Keep as string for Redux serialization - convert to Date in components
});

export const weighingApiSchema = z.object({
  id: z.uuid(),
  source: z.uuid(),
  destination: z.uuid(),
  auto: z.uuid(),
  driver: z.uuid(),
  harvester: z.uuid(),
  operator: z.uuid(),
  crop: z.uuid(),
  weight: z.number(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const weighingApiResponseSchema = z.object({
  items: z.array(weighingApiSchema),
  isLoading: z.boolean(),
  error: z.string().optional(),
});
