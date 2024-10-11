import express from "express";
import {
  getAllCategories,
  getCategoryById,
} from "../controller/CategoryController.js";

const router = express.Router();

// Routes for categories
router.get("/category", getAllCategories);
router.get("/:id", getCategoryById);

export default router;
