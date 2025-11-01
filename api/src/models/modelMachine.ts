import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../db/db.js';
import { generateTimestampFields } from './generateTimestampFields.js';
import { MachineType } from './index.js';

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
      unique: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    type: {
      type: DataTypes.UUID,
      allowNull: false,
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

Machine.belongsTo(MachineType, { foreignKey: 'type', targetKey: 'id' });
MachineType.hasMany(Machine, { foreignKey: 'type', sourceKey: 'id' });
