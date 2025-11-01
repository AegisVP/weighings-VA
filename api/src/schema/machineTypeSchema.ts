import { z } from 'zod';
import { idSchemaField, timestampSchemaFields } from './defaults.js';

export const machineTypeSchema = z.object({
  ...idSchemaField(),
  name: z.string(),
  ...timestampSchemaFields(),
});

export const addMachineTypeSchema = z.strictObject({
  name: z.string('Введіть назву типа'),
});
export type TypeAddMachineTypeSchema = z.infer<typeof addMachineTypeSchema>;

export const modifyMachineTypeSchema = z.strictObject({
  ...addMachineTypeSchema.partial().shape,
  ...idSchemaField(),
});
export type TypeModifyMachineTypeSchema = z.infer<typeof modifyMachineTypeSchema>;
