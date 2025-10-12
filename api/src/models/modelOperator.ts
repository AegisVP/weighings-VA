import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../db/db.ts';
import { generateTimestampFields } from './generateTimestampFields.ts';

export class Operator extends Model {}

Operator.init(
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
    ...generateTimestampFields(),
  },
  {
    sequelize,
    tableName: 'operators',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
