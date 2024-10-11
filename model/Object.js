import { DataTypes } from "sequelize";
import dbOCC from "../config/dbConfig.js";
import { CategoryModel } from "./CategoryModel.js";

export const Object = dbOCC.define(
  "tbl_object",
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
        model: "tbl_category",
        key: "id",
      },
    },
    object: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    tableName: "tbl_object", // Customize table name
  }
);
