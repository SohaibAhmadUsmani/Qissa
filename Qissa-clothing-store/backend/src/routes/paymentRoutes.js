import express from "express";

import {
  createCheckoutSession,
  stripeWebhook,
  verifyPayment,
} from "../controllers/paymentController.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/payments/create-checkout-session — Create a Stripe checkout session from the user's cart
router.post("/create-checkout-session", protect, createCheckoutSession);

// POST /api/payments/webhook — Stripe webhook receiver (no auth, uses Stripe signature verification)
// NOTE: Apply express.raw({ type: "application/json" }) middleware here when implementing
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// GET /api/payments/verify/:sessionId — Verify payment status by Stripe session ID
router.get("/verify/:sessionId", protect, verifyPayment);

export default router;
