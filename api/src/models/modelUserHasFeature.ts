import { DataTypes, Model } from 'sequelize';
import { generateTimestampFields } from './generateTimestampFields.js';
import { sequelize } from '../db/db.js';
import { Feature } from './modelFeature.js';
import { User } from './modelUser.js';

export class UserHasFeature extends Model {
  declare id: string;
  declare userId: string;
  declare featureId: string;
  declare expires: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare syncedAt: Date | null;
}

UserHasFeature.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      },
    },
    featureId: {
      type: DataTypes.UUID,
      references: {
        model: Feature,
        key: 'id',
      },
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ...generateTimestampFields(),
  },
  {
    sequelize,
    tableName: 'user_has_feature',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'user_has_feature_idx',
        fields: ['user_id', 'feature_id', 'expires'],
      },
    ],
  }
);

User.belongsToMany(Feature, { through: UserHasFeature, as: 'features', foreignKey: 'user_id' });
Feature.belongsToMany(User, { through: UserHasFeature, as: 'users', foreignKey: 'feature_id' });
