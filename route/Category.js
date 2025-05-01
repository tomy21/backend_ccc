import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/CategoryController.js";
import { protectAuth } from "../middleware/authMidOcc.js";

const router = express.Router();

// Routes for categories
router.post("/category/create", protectAuth, createCategory);
router.get("/category", getAllCategories);
router.get("/getById/:id", getCategoryById);
router.put("/getById/update/:id", protectAuth, updateCategory);
router.delete("/getById/delete/:id", protectAuth, deleteCategory);

export default router;
