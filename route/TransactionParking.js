import express from "express";
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  getTransactionDetail,
  updateTransactionStatus,
  deleteTransaction,
  getAllTransactionsByLocation,
  uploadFotoBukti,
} from "../controller/TransactionParking.js";

const router = express.Router();

router.get("/transaction", getAllTransactions);
router.get("/transaction/:id", getTransactionById);
router.post("/transaction/create", createTransaction);
router.get("/transaction/detail/:TransactionCode", getTransactionDetail);
router.get(
  "/transaction/byLocation/:locationCode",
  getAllTransactionsByLocation
);
router.post(
  "/transactions/:TransactionCode/update",
  uploadFotoBukti,
  updateTransactionStatus
);
router.delete("/transaction/:id", deleteTransaction);

export default router;
