import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../db/db.ts';
import { generateTimestampFields } from './generateTimestampFields.ts';

export class Location extends Model {
  declare id: string;
  declare name: string;
  declare is_source: boolean;
  declare is_destination: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Location.init(
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
    is_source: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_destination: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    ...generateTimestampFields(),
  },
  {
    sequelize,
    tableName: 'locations',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
