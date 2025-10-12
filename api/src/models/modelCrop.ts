import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../db/db.ts';
import { generateTimestampFields } from './generateTimestampFields.ts';

export class Crop extends Model {}

Crop.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ...generateTimestampFields(),
  },
  {
    sequelize,
    tableName: 'crops',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
