import type { ModelStatic } from 'sequelize';
import { DataTypes, type Model } from 'sequelize';
import { z } from 'zod';

function mapSequelizeTypeToZod(dataType: any, allowNull: boolean): z.ZodType {
  let schema: z.ZodType;

  switch (dataType.key) {
    case DataTypes.STRING.key:
    case DataTypes.TEXT.key:
      schema = z.string();
      break;
    case DataTypes.INTEGER.key:
    case DataTypes.BIGINT.key:
      schema = z.number().int();
      break;
    case DataTypes.FLOAT.key:
    case DataTypes.DOUBLE.key:
    case DataTypes.DECIMAL.key:
      schema = z.number();
      break;
    case DataTypes.BOOLEAN.key:
      schema = z.boolean();
      break;
    case DataTypes.DATE.key:
      schema = z.date();
      break;
    case DataTypes.UUID.key:
      schema = z.uuid();
      break;
    // Add more mappings as needed
    default:
      schema = z.any();
  }

  if (allowNull) {
    schema = schema.nullable();
  }

  return schema;
}

export function sequelizeModelToZod(model: ModelStatic<Model>) {
  const attributes = model.getAttributes();
  const shape: Record<string, z.ZodType> = {};

  for (const key in attributes) {
    if (Object.hasOwn(attributes, key)) {
      const attr = attributes[key];
      if (!attr) continue;
      shape[key] = mapSequelizeTypeToZod(attr.type, attr.allowNull ?? false);
      if (attr.allowNull === false) {
        // make required field non-nullable and with a custom error message
        shape[key] = shape[key].refine((value) => value !== null && value !== undefined, {
          message: `${key} is required`,
        });
      }
    }
  }

  return z.object(shape);
}
