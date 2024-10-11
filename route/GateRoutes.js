import express from "express";
import {
  getAllGates,
  getGateById,
  createGate,
  updateGate,
  deleteGate,
  getArduinoById,
} from "../controller/GateController.js";

const router = express.Router();

// Route HTTP untuk Gate
router.get("/gates", getAllGates);
router.get("/gates/:id", getGateById);
router.get("/gatesArduino/:id", getArduinoById);
router.post("/gates", (req, res) => {
  createGate(req, res);
  notifyGateUpdate(req.io, { event: "create", data: req.body });
});
router.put("/gates/:id", updateGate);
router.delete("/gates/:id", (req, res) => {
  deleteGate(req, res);
  notifyGateUpdate(req.io, { event: "delete", data: req.params.id });
});

// Fungsi untuk mengirim notifikasi WebSocket ke semua client
export const notifyGateUpdate = (io, gateData) => {
  io.emit("gateUpdate", gateData);
};

export default router;