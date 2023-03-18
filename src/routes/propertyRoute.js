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
router.get("/:id", PropertyController.getSingleProperty);

router.put(
  "/:id",
  protectedRoute,
  isUserVerified,
  PropertyController.updateProperty
);

// hide property
router.put(
  "/hideProperty/:id",
  protectedRoute,
  isUserVerified,
  PropertyController.hideProperty
);

//unhide property
router.put(
  "/unhideProperty/:id",
  protectedRoute,
  isUserVerified,
  PropertyController.unhideProperty
);

// approve property
router.put(
  "/approveProperty/:id",
  protectedRoute,
  isUserVerified,
  PropertyController.approveProperty
);
export default router;
