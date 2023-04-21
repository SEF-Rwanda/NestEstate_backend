import express from "express";
import PreferenceController from "../controllers/PreferenceController";
import protectedRoute from "../middlewares/protectRoute";
import isUserVerified from "../middlewares/isUserVerified";

const router = express.Router();

router.post(
  "/",
  protectedRoute,
  isUserVerified,
  PreferenceController.addPreference
);

export default router;
