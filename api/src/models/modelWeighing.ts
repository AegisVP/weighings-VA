import { DataTypes, Model } from 'sequelize';
import { v7 as uuidv7 } from 'uuid';

import { sequelize } from '../db/db.ts';
import { generateTimestampFields } from './generateTimestampFields.ts';
import { Crop, Location, Machine, Operator, User } from './index.ts';

export class Weighing extends Model {
  declare id: string;
  declare source: string;
  declare destination: string;
  declare auto: string | null;
  declare driver: string | null;
  declare harvester: string | null;
  declare operator: string | null;
  declare crop: string;
  declare weight: number;
  declare createdBy: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Weighing.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv7,
    },
    source: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Location,
        key: 'id',
      },
    },
    destination: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Location,
        key: 'id',
      },
    },
    auto: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Machine,
        key: 'id',
      },
    },
    driver: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Operator,
        key: 'id',
      },
    },
    harvester: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Machine,
        key: 'id',
      },
    },
    operator: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Operator,
        key: 'id',
      },
    },
    crop: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Crop,
        key: 'id',
      },
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    ...generateTimestampFields(),
  },
  {
    sequelize,
    tableName: 'weighings',
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
      beforeValidate: async weighing => {
        if (weighing && 'source' in weighing && weighing.source) {
          const source = await Location.findByPk(weighing.source);
          if (!source || !source.is_source) {
            throw new Error('Invalid source location: must have is_source = true');
          }
        }
        if (weighing && 'destination' in weighing && weighing.destination) {
          const destination = await Location.findByPk(weighing.destination);
          if (!destination || !destination.is_destination) {
            throw new Error('Invalid destination location: must have is_destination = true');
          }
        }
      },
    },
  }
);
