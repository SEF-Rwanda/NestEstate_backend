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
router.get("/", PropertyController.getAllAvailableProperties);
router.get(
  "/my-properties",
  protectedRoute,
  isUserVerified,
  PropertyController.getUserProperties
);

router.put(
  "/:id",
  protectedRoute,
  isUserVerified,
  PropertyController.updateProperty
);

export default router;
