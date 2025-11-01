import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../db/db.js';
import { generateTimestampFields } from './generateTimestampFields.js';

export class Operator extends Model {
  declare id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

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
    indexes: [
      {
        unique: true,
        name: 'operators_name_deleted_at_idx',
        fields: ['name'],
        where: {
          deleted_at: null,
        },
      },
    ],
  }
);
