import { DataTypes } from "sequelize";
import { dbOCC } from "../../config/dbConfig.js";

export const Transaction = dbOCC.define(
  "selfVipTrx",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transactionNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    locationCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    locationName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    plateNumber: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    vehicleType: {
      type: DataTypes.ENUM("MOBIL", "MOTOR"), // Tambah enum sesuai yang kamu pakai
      allowNull: false,
    },
    inTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tariffParking: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tariffVip: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    pathImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "selfVipTrx", // Nama tabel di DB (ubah jika berbeda)
    timestamps: false, // Karena kamu punya `createdAt`, tapi tidak `updatedAt`
  }
);
