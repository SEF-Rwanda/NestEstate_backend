import express from "express";
import UserController from "../controllers/UserController";
import NewUserDataChecker from "./../middlewares/NewUserDataChecker";
import CheckPassword from "../middlewares/CheckPassword";
import protectedRoute from "../middlewares/verifyUser";

const router = express.Router();

router.post(
  "/signup",
  NewUserDataChecker.validateCredentials,
  CheckPassword.checkPassword,
  UserController.createUser
);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/verifyEmail", protectedRoute, UserController.verifyEmail);

router.put("/profile/:id", UserController.updateUserProfile);

router.get("/profile/:id",UserController.getUserProfile);
export default router;
