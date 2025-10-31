import { z } from 'zod';
import { idSchemaField, timestampSchemaFields } from './defaults.js';

export const locationSchema = z.object({
  ...idSchemaField(),
  name: z.string(),
  isSource: z.boolean(),
  isDestination: z.boolean(),
  ...timestampSchemaFields(),
});

export const addLocationSchema = z.strictObject({
  name: z.string('Назва обовʼязкова'),
  isSource: z.boolean(),
  isDestination: z.boolean(),
});
export type TypeAddLocationSchema = z.infer<typeof addLocationSchema>;

export const modifyLocationSchema = z.strictObject({
  ...addLocationSchema.partial().shape,
  ...idSchemaField(),
});
export type TypeModifyLocationSchema = z.infer<typeof modifyLocationSchema>;
