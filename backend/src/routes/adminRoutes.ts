import { Router } from "express";

import {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getAdminMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/adminController";

import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get("/orders", getAllOrders);

router.patch(
  "/orders/:id/status",
  updateOrderStatus
);

router.get("/users", getAllUsers);

router.get("/menu", getAdminMenu);

router.post("/menu", createMenuItem);

router.patch(
  "/menu/:id",
  updateMenuItem
);

router.delete(
  "/menu/:id",
  deleteMenuItem
);

export default router;