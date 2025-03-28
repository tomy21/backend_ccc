import { DataTypes } from "sequelize";
import { dbOCC } from "../config/dbConfig.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Role } from "./Role.js";
import { LocationCCC } from "./Location.js";
import ParkingLocation from "./LocationParking.js";

export const Users = dbOCC.define(
  "OccUsers",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_confirmation: {
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING(255),
    },
    no_tlp: {
      type: DataTypes.STRING(20),
    },
    id_lokasi: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "OccRefLocation",
        key: "id",
      },
    },
    foto: {
      type: DataTypes.STRING(20),
    },
    id_role: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "OccRole",
        key: "id",
      },
    },
    is_active: {
      type: DataTypes.TEXT,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdBy: {
      type: DataTypes.STRING(50),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedBy: {
      type: DataTypes.STRING(50),
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
    },
    last_active: {
      type: DataTypes.DATE,
    },
    activation_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activation_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: true }
);

Users.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 12);
});

Users.prototype.createActivationToken = function () {
  const activationToken = crypto.randomBytes(32).toString("hex");
  this.activation_token = crypto
    .createHash("sha256")
    .update(activationToken)
    .digest("hex");
  this.activation_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return activationToken;
};

Users.prototype.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

Users.belongsTo(Role, {
  foreignKey: "id_role",
  targetKey: "id",
});

Users.belongsTo(LocationCCC, {
  foreignKey: "id_lokasi",
  targetKey: "id",
});
Users.belongsTo(ParkingLocation, {
  foreignKey: "id_lokasi",
  targetKey: "id",
});
