import z from 'zod';
import { idSchemaField, timestampSchemaFields } from './defaults.js';

export const featureSchema = z.object({
  ...idSchemaField(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  ...timestampSchemaFields(),
  UserHasFeature: z.object({
    expires: z.date(),
  }),
});

export type TypeFeatureSchema = z.infer<typeof featureSchema>;
