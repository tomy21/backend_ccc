import express from "express";
import {
  login,
  register,
  getUserById,
  logout,
  getAllUsers,
} from "../controller/Users.js";
import { protectAuth } from "../middleware/authMidOcc.js";

const router = express.Router();

// Route HTTP untuk Gate
router.post("/login", login);
router.post("/register", register);
router.post("/logout", protectAuth, logout);
router.get("/getUserById", protectAuth, getUserById);
router.get("/getAllUsers", getAllUsers);

router.get("/protected", protectAuth, (req, res) => {
  const token = req.cookies.refreshToken;
  res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "You have access to this route",
    token: token,
  });
});

export default router;
