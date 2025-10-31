import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../db/db.js';

export class MigrationVersion extends Model {
  declare version: number;
  declare appliedAt: Date;
}

MigrationVersion.init(
  {
    version: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'migrations',
    timestamps: false,
    underscored: true,
  }
);

// MigrationVersion.sync({ alter: true, force: true });
