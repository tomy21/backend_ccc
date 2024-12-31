import express from "express";
import { streamCCTV } from "../controller/Streaming.js";

const router = express.Router();

// Route untuk streaming CCTV
router.get("/stream", streamCCTV);

export default router;
