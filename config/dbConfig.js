import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

export const dbOCC = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    timezone: "+07:00",
  }
);

export const dbUnikas = new Sequelize(
  process.env.DB_NAME_UNIKAS,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    timezone: "+07:00",
  }
);

dbUnikas
  .authenticate()
  .then(() => {
    console.log("Koneksi ke database Unikas berhasil.");
  })
  .catch((error) => {
    console.error("Gagal terhubung ke database Unikas:", error);
  });
