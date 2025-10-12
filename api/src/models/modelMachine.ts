import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../db/db.ts';
import { generateTimestampFields } from './generateTimestampFields.ts';
import { MachineType } from './index.ts';

export class Machine extends Model {
  declare id: string;
  declare licensePlate: string;
  declare make: string;
  declare model: string;
  declare description: string;
  declare type: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Machine.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
    },
    type: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: false,
      references: {
        model: MachineType,
        key: 'id',
      },
    },
    ...generateTimestampFields(),
  },
  {
    sequelize,
    tableName: 'machines',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
