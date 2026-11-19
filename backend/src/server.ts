import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { connectDB } from "./config/db";

import authRoutes from "./routes/authRoutes";
import menuRoutes from "./routes/menuRoutes";
import orderRoutes from "./routes/orderRoutes";
import adminRoutes from "./routes/adminRoutes";
import paymentRoutes from "./routes/paymentRoutes";

import { errorHandler } from "./middleware/errorMiddleware";

const app = express();

const PORT =
  Number(process.env.PORT) || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:3000";

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());

/*
 * Stripe webhook must receive the raw body.
 */
app.use(
  "/api/payments/stripe/webhook",
  express.raw({
    type: "application/json",
  })
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

app.get(
  "/",
  (req, res) => {
    res.json({
      message:
        "Foodies API is running",
    });
  }
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/menu",
  menuRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(
    PORT,
    () => {
      console.log(
        `Foodies backend running on http://localhost:${PORT}`
      );
    }
  );
});