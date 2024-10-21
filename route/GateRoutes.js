import express from "express";
import {
  getAllGates,
  getGateById,
  createGate,
  updateGate,
  deleteGate,
  getArduinoById,
  updateGateArduino,
} from "../controller/GateController.js";
import { protectAuth } from "../middleware/authMidOcc.js";

const router = express.Router();

// Route HTTP untuk Gate
router.get("/gates", getAllGates);
router.get("/gates/:id", getGateById);
router.get("/gatesArduino/:id", getArduinoById);
router.post("/gates", (req, res) => {
  createGate(req, res);
  notifyGateUpdate(req.io, { event: "create", data: req.body });
});
router.put("/gates/:id", protectAuth, updateGate);
router.put("/gates/arduino/:id", updateGateArduino);
router.delete("/gates/:id", (req, res) => {
  deleteGate(req, res);
  notifyGateUpdate(req.io, { event: "delete", data: req.params.id });
});

// Fungsi untuk mengirim notifikasi WebSocket ke semua client
export const notifyGateUpdate = (io, gateData) => {
  io.emit("gateUpdate", gateData);
};

export default router;
