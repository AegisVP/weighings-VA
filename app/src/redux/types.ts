import type z from 'zod';
import { cropSchema } from '../../../api/src/schema/cropSchema';
import { locationSchema } from '../../../api/src/schema/locationSchema';
import { machineSchema } from '../../../api/src/schema/machineSchema';
import { operatorSchema } from '../../../api/src/schema/operatorSchema';
import { featureSchema } from '../../../api/src/schema/featureSchema';
import { userSchema } from '../schema/userSchema';
import { weighingSchema } from '../schema/weighingSchema';

export type TypeApiError = string;
export type TypeCropSchema = z.infer<typeof cropSchema>;
export type TypeLocationSchema = z.infer<typeof locationSchema>;
export type TypeMachineSchema = z.infer<typeof machineSchema>;
export type TypeOperatorSchema = z.infer<typeof operatorSchema>;
export type TypeFeatureSchema = z.infer<typeof featureSchema>;
export type TypeUserSchema = z.infer<typeof userSchema>;
export type TypeWeighingSchema = z.infer<typeof weighingSchema>;
export type TypeAllResources = TypeCropSchema | TypeLocationSchema | TypeMachineSchema | TypeOperatorSchema;
