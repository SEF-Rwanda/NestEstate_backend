import express from "express";
import ChatController from "../controllers/ChatController";
import protectedRoute from "../middlewares/protectRoute";
import isUserVerified from "../middlewares/isUserVerified";

const router = express.Router();

router.post("/", protectedRoute, isUserVerified, ChatController.createChat);
router.get("/", protectedRoute, isUserVerified, ChatController.getChats);

export default router;
