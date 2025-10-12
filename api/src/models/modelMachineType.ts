import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../db/db.ts';
import { generateTimestampFields } from './generateTimestampFields.ts';

export class MachineType extends Model {
  declare id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

MachineType.init(
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
    tableName: 'machine_types',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
