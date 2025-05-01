import express from "express";
import {
  getAllCCTV,
  getCCTVById,
  getCCTVByLokasi,
  createCCTV,
  updateCCTV,
  deleteCCTV,
} from "../controller/CCTVController.js";

const router = express.Router();

router.get("/cctv/", getAllCCTV); // Bisa menerima query `page`, `limit`, `search`
router.get("/cctv/:id", getCCTVById);
router.get("/cctv/lokasi/:id_lokasi", getCCTVByLokasi); // Bisa menerima query `page`, `limit`, `search`
router.post("/cctv/", createCCTV);
router.put("/cctv/:id", updateCCTV);
router.delete("/cctv/:id", deleteCCTV);

export default router;
