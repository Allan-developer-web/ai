import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
} from "../controllers/orderController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.post("/", createOrder);

router.get("/", getMyOrders);

router.get("/:id", getMyOrder);

router.patch("/:id/cancel", cancelOrder);

export default router;