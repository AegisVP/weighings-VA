import { z } from 'zod';
import { idSchemaField, timestampSchemaFields } from './defaults.js';

export const operatorSchema = z.object({
  ...idSchemaField(),
  name: z.string(),
  ...timestampSchemaFields(),
});

export const addOperatorSchema = z.strictObject({
  name: z.string('Введіть імʼя оператора'),
});
export type TypeAddOperatorSchema = z.infer<typeof addOperatorSchema>;

export const modifyOperatorSchema = z.strictObject({
  ...addOperatorSchema.partial().shape,
  ...idSchemaField(),
});
export type TypeModifyOperatorSchema = z.infer<typeof modifyOperatorSchema>;
