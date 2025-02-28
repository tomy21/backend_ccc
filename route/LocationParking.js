import express from "express";
import {
  getAllParkingLocations,
  getParkingLocationById,
  createParkingLocation,
  updateParkingLocation,
  deleteParkingLocation,
} from "../controller/LocationParking.js";

const router = express.Router();

router.get("/location", getAllParkingLocations);
router.get("/location/:id", getParkingLocationById);
router.post("/location", createParkingLocation);
router.put("/location/:id", updateParkingLocation);
router.delete("/location/:id", deleteParkingLocation);

export default router;
