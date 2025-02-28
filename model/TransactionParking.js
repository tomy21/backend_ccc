import { DataTypes } from "sequelize";
import { dbOCC } from "../config/dbConfig.js";

const Transaction = dbOCC.define(
  "TransactionParkingMobile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TransactionCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    RefNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    LocationName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Vendor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Tariff: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    InTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    OutTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    TypeVehicle: {
      type: DataTypes.ENUM("Mobil", "Motor"),
      allowNull: false,
    },
    FotoBuktiPembayaran: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM("In", "Out"),
      allowNull: false,
      defaultValue: "Pending",
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
    tableName: "TransactionParkingMobile",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
  }
);

export default Transaction;
