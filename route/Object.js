import express from "express";
import {
  createObject,
  getAllObjects,
  getObjectById,
  updateObject,
  deleteObject,
} from "../controller/ObjectController.js";

const router = express.Router();

// Route untuk CRUD
router.post("/object", createObject); // Create Object
router.get("/object/getAll", getAllObjects); // Read/Get All Objects
router.get("/object/:id", getObjectById); // Read/Get Object by ID
router.put("/object/:id", updateObject); // Update Object by ID
router.delete("/object/:id", deleteObject); // Delete Object by ID

export default router;
