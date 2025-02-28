import { DataTypes } from "sequelize";
import { dbOCC } from "../config/dbConfig.js";

const ParkingLocation = dbOCC.define(
  "LocationParking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    LocationCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    LocationName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Vendor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    TariffMobil: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TariffMotor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    GracePeriod: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    NMID: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TID: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    QrisText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    NameQris: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "LocationParking",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
  }
);

export default ParkingLocation;
