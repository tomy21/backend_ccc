import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controller/selfVip/Transaction.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

router.post("/self-valet", upload.single("image"), createTransaction);
router.get("/self-valet", getAllTransactions);
router.get("/self-valet/:id", getTransactionById);
router.put("/self-valet/:id", updateTransaction);
router.delete("self-valet/:id", deleteTransaction);

export default router;
