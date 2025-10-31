import { type ZodDate, type ZodOptional, type ZodUUID, z } from 'zod';

export const getByIdSchema = z.strictObject({ id: z.uuid() });
export type TypeGetById = z.infer<typeof getByIdSchema>;

export const getDeletedQuerySchema = z.strictObject({ deleted: z.string().nullish() });
export type TypeGetDeletedQuery = z.infer<typeof getDeletedQuerySchema>;

type TypeTimestampFields = {
  createdAt?: ZodDate;
  updatedAt?: ZodDate;
  deletedAt?: ZodDate | ZodOptional;
};
export const timestampSchemaFields = (isParanoid = true): TypeTimestampFields => {
  const retObj: TypeTimestampFields = {
    createdAt: z.date(),
    updatedAt: z.date(),
  };

  if (isParanoid) {
    retObj.deletedAt = z.date().optional();
  }

  return retObj;
};

type TypeIdField = { id: ZodUUID };
export const idSchemaField = (): TypeIdField => ({ id: z.uuid('ID обовʼязкове') });

type TypeDefaultSchemaFields = TypeIdField & TypeTimestampFields;
export const defaultSchemaFields = (timestamps = true, isParanoid = true): TypeDefaultSchemaFields => {
  const retObj: TypeDefaultSchemaFields = idSchemaField();

  if (timestamps) {
    return {
      ...retObj,
      ...timestampSchemaFields(isParanoid),
    };
  }
  return retObj;
};
