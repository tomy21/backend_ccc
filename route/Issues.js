import express from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  createIssueByArduino,
} from "../controller/Issues.js";
import { protectAuth } from "../middleware/authMidOcc.js";

const router = express.Router();

router.post("/issues/create", protectAuth, createIssue); // Create Issue
router.post("/issues/createByArduino", createIssueByArduino); // Create Issue
router.get("/issues/getAll", getAllIssues); // Get All Issues
router.get("/issues/getById/:id", getIssueById); // Get Issue by ID
router.put("/issues/updated/:id", protectAuth, updateIssue); // Update Issue by ID
router.delete("/issues/deleted:id", deleteIssue); // Delete Issue by ID

export default router;
