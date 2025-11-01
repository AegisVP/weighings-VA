import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/db.js';
import { generateTimestampFields } from './generateTimestampFields.js';

export class Feature extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare enabled: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Feature.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ...generateTimestampFields(),
  },
  {
    sequelize,
    tableName: 'features',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'features_name',
        fields: ['name'],
      },
    ],
  }
);
