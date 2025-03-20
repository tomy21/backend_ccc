import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import OccCapture from "./route/index.js";
import GateRoutes from "./route/GateRoutes.js";
import HikvisionIntegration from "./route/HikvisionRoutes.js";
import userOcc from "./route/Users.js";
import issuesOcc from "./route/Issues.js";
import category from "./route/Category.js";
import descriptionRoute from "./route/Description.js";
import transactionParking from "./route/TransactionParkingIntegration.js";
import logActivity from "./route/LogActivity.js";
import StreamingCCTV from "./route/Streaming.js";
import LocationParkingRoute from "./route/LocationParking.js";
import TransactionParkingRoute from "./route/TransactionParking.js";
import Location from "./route/Location.js";

import { initRelations } from "./model/Relation.js";

import { createServer } from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = createServer(app); // Gunakan HTTP server

app.use(
  cors({
    origin: ["http://localhost:3000", "https://dev-occ.skyparking.online"],
    credentials: true,
  })
);
app.options("*", cors());

const wss = new WebSocketServer({ server });
let isPopupActive = false;

// Saat ada koneksi baru dari client
wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("message", (message) => {
    console.log(`Client message: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected from WebSocket");
  });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(bodyParser.json());

initRelations();

app.use("/v01/occ/api", HikvisionIntegration);
app.use("/v01/occ/api", OccCapture);
app.use("/v01/occ/api", GateRoutes);
app.use("/v01/occ/api", userOcc);
app.use("/v01/occ/api", issuesOcc);
app.use("/v01/occ/api", category);
app.use("/v01/occ/api", descriptionRoute);
app.use("/v01/occ/api", transactionParking);
app.use("/v01/occ/api", logActivity);
app.use("/v01/occ/api", StreamingCCTV);
app.use("/v01/occ/api", Location);

app.use("/v01/parking/api", LocationParkingRoute);
app.use("/v01/parking/api", TransactionParkingRoute);

// ✅ Endpoint untuk trigger popup
app.post("/trigger-popup", (req, res) => {
  const { userLocation } = req.body;
  
  if (!userLocation) {
    return res.status(400).json({ success: false, message: "User location is required" });
  }

  if (isPopupActive) {
    return res.status(400).json({ success: false, message: "Popup is already active!" });
  }

  isPopupActive = true; // Set popup aktif

  const message = JSON.stringify({ showPopup: true, userLocation });

  wss.clients.forEach(client => {
    if (client.readyState === 1) { // Pastikan WebSocket masih terbuka
      client.send(message);
    }
  });

  console.log(`📢 Popup triggered for location: ${userLocation}`);
  res.json({ success: true, message: `Popup triggered for ${userLocation}` });
});

// ✅ Endpoint untuk menutup popup
app.post("/close-popup", (req, res) => {
  if (!isPopupActive) {
    return res.status(400).json({ success: false, message: "No active popup to close!" });
  }

  isPopupActive = false; // Set popup tidak aktif

  const message = JSON.stringify({ showPopup: false });

  console.log("❌ Sending WebSocket message:", message);

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });

  res.json({ success: true, message: "Popup closed" });
});

const PORT = 7001;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
