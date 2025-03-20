import express from "express";
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationsAll,
} from "../controller/Location.js";

const router = express.Router();

// Route untuk streaming CCTV
router.get("/location-occ/get-all", getAllLocations);
router.get("/location-occ/get-all-status", getLocationsAll);
router.get("/location-occ/get-byid/:id", getLocationById);
router.post("/location-occ/create-data", createLocation);
router.put("/location-occ/update-data/:id", updateLocation);
router.delete("/location-occ/delete-data/:id", deleteLocation);

export default router;
