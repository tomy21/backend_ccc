import express from "express";
import {
  captureImage,
  streamVideo,
} from "../controller/hikvisionController.js";

const router = express.Router();

// Rute untuk menangkap gambar (capture)
router.get("/hikvision/capture", captureImage);

// Rute untuk memulai streaming video
router.get("/cctv/stream", streamVideo);

export default router;
