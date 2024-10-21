import express from "express";
import {
  createLogActivity,
  getAllLogActivities,
  getLogActivityById,
  updateLogActivity,
  deleteLogActivity,
} from "../controller/LogActivity.js";

const router = express.Router();

// Create
router.post("/logs", createLogActivity);

// Read All
router.get("/logs/getAll", getAllLogActivities);

// Read by ID
router.get("/logs/getById/:id", getLogActivityById);

// Update
router.put("/logs/:id", updateLogActivity);

// Delete
router.delete("/logs/:id", deleteLogActivity);

export default router;
