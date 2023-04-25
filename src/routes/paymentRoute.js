const express = require("express");
import PaymentController from "../controllers/PaymentController";
import protectedRoute from "../middlewares/protectRoute";

const router = express.Router();

router.post(
  "/create-checkout-session",
  protectedRoute,
  PaymentController.makePayment
);

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  PaymentController.webhook
);

router.get(
  "/view-my-payments",
  protectedRoute,
  PaymentController.viewMyPayments
);
router.get(
  "/view-all-payments",
  protectedRoute,
  PaymentController.viewAllPayments
);

export default router;
