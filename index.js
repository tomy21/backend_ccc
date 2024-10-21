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
import { initRelations } from "./model/Relation.js";

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

app.use(
  cors({
    credentials: true,
    origin: ["*", "http://localhost:3000", "https://dev-occ.skyparking.online"],
  })
);

const io = new Server(httpServer, {
  cors: {
    origin: ["*", "http://localhost:3000", "https://dev-occ.skyparking.online"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

initRelations();

app.use("/v01/occ/api", HikvisionIntegration);
app.use("/v01/occ/api", OccCapture);
app.use("/v01/occ/api", GateRoutes);
app.use("/v01/occ/api", userOcc);
app.use("/v01/occ/api", issuesOcc);
app.use("/v01/occ/api", category);
app.use("/v01/occ/api", descriptionRoute);
app.use("/v01/occ/api", transactionParking);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Mengirim pesan ke client setelah terhubung
  socket.emit("welcome", { message: "Welcome to Socket.IO server" });

  // Menerima pesan dari client
  socket.on("message", (msg) => {
    console.log(`Message from client: ${msg}`);

    // Kirim balasan ke client yang sama
    socket.emit("response", { message: "Message received" });
  });

  // Event untuk menangani disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 5001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
