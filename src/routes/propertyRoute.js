import express from "express";
import PropertyController from "../controllers/PropertyController";
import protectedRoute from "../middlewares/protectRoute";
import isUserVerified from "../middlewares/isUserVerified";

const router = express.Router();

router.post(
  "/",
  protectedRoute,
  isUserVerified,
  PropertyController.addProperty
);

export default router;
