import z from 'zod';
import { idSchemaField, timestampSchemaFields } from '../../../api/src/schema/defaults';
import { locationSchema } from '../../../api/src/schema/locationSchema';
import { machineSchema } from '../../../api/src/schema/machineSchema';
import { operatorSchema } from '../../../api/src/schema/operatorSchema';
import { cropSchema } from '../../../api/src/schema/cropSchema';

export const weighingSchema = z.object({
  ...idSchemaField(),
  source: locationSchema,
  destination: locationSchema,
  transport: z.object({
    machine: machineSchema,
    operator: operatorSchema,
  }),
  harvester: z.object({
    machine: machineSchema,
    operator: operatorSchema,
  }),
  crop: cropSchema,
  weight: z.number(),
  ...timestampSchemaFields(),
});
