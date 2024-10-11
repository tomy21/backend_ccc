import express from "express";
import { captureImage } from "../controller/integration.js";
import { getLocations } from "../controller/index.js";

const router = express.Router();

router.post("/capture-camera", captureImage);
router.get("/getLocation", getLocations);

export default router;
