import express from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  createIssueByArduino,
  summaryByCategory,
  summaryByMonth,
  summaryIssues,
} from "../controller/Issues.js";
import { protectAuth } from "../middleware/authMidOcc.js";

const router = express.Router();

router.post("/issues/create", protectAuth, createIssue);
router.post("/issues/createByArduino", createIssueByArduino);
router.get("/issues/getAll", getAllIssues);
router.get("/issues/getById/:id", getIssueById);
router.put("/issues/updated/:id", protectAuth, updateIssue);
router.delete("/issues/deleted:id", deleteIssue);
router.get("/issues/getSummaryCategory", summaryByCategory);
router.get("/issues/getSummaryMonth", summaryByMonth);
router.get("/issues/getSummary", summaryIssues);

export default router;
