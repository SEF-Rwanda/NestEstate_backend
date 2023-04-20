const express = require("express");
import PaymentController from "../controllers/PaymentController";
const router = express.Router();

router.post("/create-checkout-session", PaymentController.makePayment);

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  PaymentController.webhook
);

export default router;
