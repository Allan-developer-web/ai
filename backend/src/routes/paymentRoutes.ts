import { Router } from "express";

import {
  mpesaStkPush,
  mpesaCallback,
  createStripeCheckout,
  stripeWebhook,
} from "../controllers/paymentController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/mpesa/stkpush",
  protect,
  mpesaStkPush
);

router.post(
  "/mpesa/callback",
  mpesaCallback
);

router.post(
  "/stripe/checkout",
  protect,
  createStripeCheckout
);

router.post(
  "/stripe/webhook",
  stripeWebhook
);

export default router;