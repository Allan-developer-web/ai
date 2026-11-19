import { Router } from "express";
import {
  register,
  login,
  logout,
} from "../controllers/authController";
import User from "../models/User";
import { protect, AuthRequest } from "../middleware/authMiddleware";
import { authRateLimit } from "../middleware/rateLimit";

const router = Router();

router.post(
  "/register",
  authRateLimit,
  register
);

router.post(
  "/login",
  authRateLimit,
  login
);

router.post("/logout", logout);

router.get(
  "/me",
  protect,
  async (req: AuthRequest, res) => {
    const user = await User.findById(
      req.user!.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  }
);

router.get("/dashboard", protect, (req: AuthRequest, res) => {
  res.json({ message: "Welcome to dashboard" });
});

export default router;