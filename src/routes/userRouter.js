import express from "express";
import UserController from "../controllers/UserController";
import NewUserDataChecker from "./../middlewares/NewUserDataChecker";
import CheckPassword from "../middlewares/CheckPassword";
import protectedRoute from "../middlewares/protectRoute";
const router = express.Router();

router.post(
  "/signup",
  NewUserDataChecker.validateEmail,
  NewUserDataChecker.validatePhone,
  CheckPassword.checkPassword,
  UserController.createUser
);

router.post("/forgotPassword", UserController.forgotPassword);
router.patch("/resetPassword/:token", UserController.resetPassword);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/verifyEmail", protectedRoute, UserController.verifyEmail);

router.put("/profile/:id", UserController.updateUserProfile);

router.get("/profile/:id", UserController.getUserProfile);

router.get("/", UserController.getAllUsers);

export default router;
