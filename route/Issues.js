import express from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from "../controller/Issues.js";

const router = express.Router();

router.post("/issues/create", createIssue); // Create Issue
router.get("/issues/getAll", getAllIssues); // Get All Issues
router.get("/issues/getById/:id", getIssueById); // Get Issue by ID
router.put("/issues/updated/:id", updateIssue); // Update Issue by ID
router.delete("/issues/deleted:id", deleteIssue); // Delete Issue by ID

export default router;
