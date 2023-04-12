import express from "express";
import MessageController from "../controllers/MessageController";
import protectedRoute from "../middlewares/protectRoute";
import isUserVerified from "../middlewares/isUserVerified";

const router = express.Router();

router.post("/", protectedRoute, isUserVerified, MessageController.sendMessage);
router.get(
  "/:chatId",
  protectedRoute,
  isUserVerified,
  MessageController.getMessages
);

export default router;
