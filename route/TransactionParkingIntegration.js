import express from "express";
import {
  getByLicensePlateIn,
  getAllTransactions,
} from "../controller/TransactionParkingIntegration.js";

const router = express.Router();

// Route untuk CRUD
router.get("/transactionParking/:licensePlate", getByLicensePlateIn);
router.get("/transactionParking/getAll", getAllTransactions);

export default router;
