import { z } from 'zod';
import { idSchemaField, timestampSchemaFields } from './defaults.js';

export const machineSchema = z.object({
  ...idSchemaField(),
  licensePlate: z.string(),
  make: z.string(),
  model: z.string(),
  description: z.string(),
  canDeliver: z.boolean(),
  canHarvest: z.boolean(),
  ...timestampSchemaFields(),
});

export const addMachineSchema = z.strictObject({
  licensePlate: z.string('Номерний знак обовʼязковий'),
  make: z.string().optional(),
  model: z.string().optional(),
  description: z.string().optional(),
  canDeliver: z.boolean().default(false),
  canHarvest: z.boolean().default(false),
});
export type TypeAddMachineSchema = z.infer<typeof addMachineSchema>;

export const modifyMachineSchema = z.strictObject({
  ...addMachineSchema.partial().shape,
  ...idSchemaField(),
});
export type TypeModifyMachineSchema = z.infer<typeof modifyMachineSchema>;
