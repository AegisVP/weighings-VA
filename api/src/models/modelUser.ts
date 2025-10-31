import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import { sequelize } from '../db/db.js';
import { defaultSchemaFields } from '../schema/defaults.js';
import { generateTimestampFields } from './generateTimestampFields.js';
import { Feature } from './modelFeature.js';

export class User extends Model {
  declare id: string;
  declare name: string;
  declare username: string;
  declare password: string;
  declare token: string | null;
  declare refreshToken: string | null;
  declare features: Feature[];
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ...generateTimestampFields(),
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: true,
    defaultScope: {
      include: [
        {
          model: Feature,
          as: 'features',
          through: { attributes: ['expires'] },
        },
      ],
    },
  }
);

export const userSchema = z.object({
  ...defaultSchemaFields,
  name: z.string(),
  username: z.string(),
  password: z.string(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
});
