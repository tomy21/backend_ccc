import { DataTypes } from "sequelize";
import dbOCC from "../config/dbConfig.js";
import { Object } from "./Object.js";

export const CategoryModel = dbOCC.define(
  "tbl_category",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category: {
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
    tableName: "tbl_category", // Customize table name
  }
);

// Definisi relasi One-to-Many
CategoryModel.hasMany(Object, {
  foreignKey: "id_category", // Foreign key di Object
  as: "objects", // Alias untuk array Object di Category
});
