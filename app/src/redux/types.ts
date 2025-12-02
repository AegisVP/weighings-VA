import type z from 'zod';
import { cropSchema } from '../../../api/src/schema/cropSchema';
import { locationSchema } from '../../../api/src/schema/locationSchema';
import { machineSchema } from '../../../api/src/schema/machineSchema';
import { operatorSchema } from '../../../api/src/schema/operatorSchema';
import { featureSchema } from '../../../api/src/schema/featureSchema';
import { userSchema } from '../schema/userSchema';
import { weighingSchema } from '../schema/weighingSchema';

export type TypeDefaultTimestamps = {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  syncedAt?: string;
};

export type TypeApiError = string;
export type TypeCropSchema = Omit<z.infer<typeof cropSchema>, keyof TypeDefaultTimestamps> & TypeDefaultTimestamps;
export type TypeLocationSchema = Omit<z.infer<typeof locationSchema>, keyof TypeDefaultTimestamps> &
  TypeDefaultTimestamps;
export type TypeMachineSchema = Omit<z.infer<typeof machineSchema>, keyof TypeDefaultTimestamps> &
  TypeDefaultTimestamps;
export type TypeOperatorSchema = Omit<z.infer<typeof operatorSchema>, keyof TypeDefaultTimestamps> &
  TypeDefaultTimestamps;
export type TypeFeatureSchema = z.infer<typeof featureSchema>;
export type TypeUserSchema = z.infer<typeof userSchema>;
export type TypeWeighingSchema = z.infer<typeof weighingSchema>;
export type TypeAllResources = TypeCropSchema | TypeLocationSchema | TypeMachineSchema | TypeOperatorSchema;
