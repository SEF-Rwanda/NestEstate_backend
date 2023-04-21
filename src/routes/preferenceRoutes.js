import express from "express";
import PreferenceController from "../controllers/PreferenceController";
import protectedRoute from "../middlewares/protectRoute";
import isUserVerified from "../middlewares/isUserVerified";
import { checkExistingPreference } from "../middlewares/checkExistingPreference";

const router = express.Router();

router.post(
  "/",
  protectedRoute,
  isUserVerified,
  checkExistingPreference,
  PreferenceController.addPreference
);

export default router;
