import { DataTypes } from "sequelize";
import { dbOCC } from "../config/dbConfig.js";
import { Description } from "./Description.js";

export const CategoryModel = dbOCC.define(
  "OccCategory",
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
    tableName: "OccCategory", // Customize table name
  }
);

// Definisi relasi One-to-Many
CategoryModel.hasMany(Description, {
  foreignKey: "id_category", // Foreign key di Object
  as: "description", // Alias untuk array Object di Category
});
