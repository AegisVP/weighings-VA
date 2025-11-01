import { DataTypes } from 'sequelize';

type timestampField = {
  type: DataTypes.DateDataTypeConstructor;
  defaultValue?: DataTypes.AbstractDataTypeConstructor;
  allowNull?: boolean;
};
type timestampFields = {
  createdAt?: timestampField;
  updatedAt?: timestampField;
  deletedAt?: timestampField;
};
type funcDef = (args?: { createdAt?: boolean; updatedAt?: boolean; deletedAt?: boolean }) => timestampFields;
export const generateTimestampFields: funcDef = (argv) => {
  const { createdAt = true, updatedAt = true, deletedAt = true } = argv || {};
  const fields: timestampFields = {};

  if (createdAt) {
    fields.createdAt = {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    };
  }

  if (updatedAt) {
    fields.updatedAt = {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    };
  }

  if (deletedAt) {
    fields.deletedAt = {
      type: DataTypes.DATE,
      allowNull: true,
    };
  }

  return fields;
};
