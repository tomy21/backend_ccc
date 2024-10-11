import { DataTypes } from "sequelize";
import dbOCC from "../config/dbConfig.js";
import { Gate } from "./Gate.js";

export const IssuesModel = dbOCC.define(
  "tbl_issues",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    ticket: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lokasi: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    id_gate: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tbl_gate",
        key: "id",
      },
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    number_plate: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("new", "in progress", "solved"),
      allowNull: false,
      defaultValue: "new",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "tbl_issues",
  }
);
