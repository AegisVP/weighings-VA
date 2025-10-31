import { z } from 'zod';
import { idSchemaField, timestampSchemaFields } from './defaults.js';

export const cropSchema = z.object({
  ...idSchemaField(),
  name: z.string(),
  ...timestampSchemaFields(),
});

export const addCropSchema = z.strictObject({
  name: z.string('Введіть назву культури'),
});
export type TypeAddCropSchema = z.infer<typeof addCropSchema>;

export const modifyCropSchema = z.strictObject({
  ...addCropSchema.partial().shape,
  ...idSchemaField(),
});
export type TypeModifyCropSchema = z.infer<typeof modifyCropSchema>;
