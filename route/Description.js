import express from "express";
import {
  createDescription,
  getAllDescription,
  getDescriptionById,
  updateDescription,
  deleteDescription,
} from "../controller/ObjectController.js";
import { protectAuth } from "../middleware/authMidOcc.js";

const router = express.Router();

// Route untuk CRUD
router.post("/object", protectAuth, createDescription);
router.get("/object/getAll", getAllDescription);
router.get("/object/byIdCategory", getDescriptionById);
router.put("/object/:id", updateDescription);
router.delete("/object/:id", deleteDescription);

export default router;
