import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../db/db.js';
import { generateTimestampFields } from './generateTimestampFields.js';

export class Machine extends Model {
  declare id: string;
  declare licensePlate: string;
  declare make: string;
  declare model: string;
  declare description: string;
  declare canDeliver: boolean;
  declare canHarvest: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare syncedAt: Date | null;
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
      unique: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    canDeliver: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    canHarvest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    ...generateTimestampFields(),
  },
  {
    sequelize,
    tableName: 'machines',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'license_plate_deleted_at_idx',
        fields: ['license_plate'],
        where: {
          deleted_at: null,
        },
      },
    ],
  }
);
