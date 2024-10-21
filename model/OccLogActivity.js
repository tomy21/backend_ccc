import { DataTypes } from "sequelize";
import { dbOCC } from "../config/dbConfig.js";
import { Users } from "./Users.js";

export const OccLogActivity = dbOCC.define(
  "LogOccActivity",
  {
    id_users: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "OccUsers",
        key: "id",
      },
    },
    activity: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "LogOccActivity",
    timestamps: true,
    paranoid: true, // Untuk soft delete
  }
);

OccLogActivity.belongsTo(Users, {
  foreignKey: "id_users",
  targetKey: "id",
});
