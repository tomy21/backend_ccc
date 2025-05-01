import { DataTypes } from "sequelize";
import { dbOCC } from "../config/dbConfig.js";
import { LocationCCC } from "./Location.js";

export const CCTV = dbOCC.define(
  "OccCctv",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_lokasi: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    ip_cctv: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    rtsp_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    capture_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    channel: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    paranoid: true, // Enable soft delete
    tableName: "OccCctv", // Nama tabel di database
  }
);

CCTV.belongsTo(LocationCCC, {
  foreignKey: "id_lokasi", // Foreign key di Gate
  targetKey: "id", // Primary key di LocationCCC
  as: "location", // Alias untuk relasi ini
});

export default CCTV;
