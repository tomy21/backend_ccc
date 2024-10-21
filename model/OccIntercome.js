import { DataTypes } from "sequelize";
import { dbOCC } from "../config/dbConfig.js";

export const OccIntercome = dbOCC.define(
  "OccIntercome",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    GateName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Locations: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    paranoid: true, // Enable soft delete
    tableName: "OccIntercome", // Customize table name
  }
);
