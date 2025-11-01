import { z } from 'zod';
import { idSchemaField, timestampSchemaFields } from './defaults.js';
import { machineTypeSchema } from './machineTypeSchema.js';

export const machineSchema = z.object({
  ...idSchemaField(),
  licensePlate: z.string(),
  make: z.string(),
  model: z.string(),
  description: z.string(),
  type: machineTypeSchema,
  ...timestampSchemaFields(),
});

export const addMachineSchema = z.strictObject({
  licensePlate: z.string('Номерний знак обовʼязковий'),
  type: z.uuid('Тип обовʼязковий'),
  make: z.string().optional(),
  model: z.string().optional(),
  description: z.string().optional(),
});
export type TypeAddMachineSchema = z.infer<typeof addMachineSchema>;

export const modifyMachineSchema = z.strictObject({
  ...addMachineSchema.partial().shape,
  ...idSchemaField(),
});
export type TypeModifyMachineSchema = z.infer<typeof modifyMachineSchema>;
