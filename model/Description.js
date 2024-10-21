import { DataTypes } from "sequelize";
import { dbOCC } from "../config/dbConfig.js";

export const Description = dbOCC.define(
  "OccDescription",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "OccCategory",
        key: "id",
      },
    },
    object: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modifyBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    paranoid: true, // Enable soft delete
    tableName: "OccDescription", // Customize table name
  }
);
