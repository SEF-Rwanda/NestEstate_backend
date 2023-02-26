import express from "express";
import UserController from "../controllers/UserController";
import NewUserDataChecker from "./../middlewares/NewUserDataChecker";
import CheckPassword from "../middlewares/CheckPassword";

const router = express.Router();

router.post(
  "/signup",
  NewUserDataChecker.validateCredentials,
  CheckPassword.checkPassword,

  UserController.createUser
);

router.post("/forgotPassword", UserController.forgotPassword);
router.patch("/resetPassword/:token", UserController.resetPassword);

export default router;
