import { DataTypes } from "sequelize";
import { dbOCC } from "../config/dbConfig.js";

export const LocationCCC = dbOCC.define(
  "OccRefLocation",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Code: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Region: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Vendor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    VendorParkingCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ShortName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    StartTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    EndTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    DateNext: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TimeZone: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
    DeletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    recordStatus: {
      type: DataTypes.ENUM(0, 1, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    paranoid: true, // Enable soft delete
    tableName: "OccRefLocation", // Customize table name
  }
);
