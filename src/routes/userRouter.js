import express from "express";
import UserController from "../controllers/UserController";
import NewUserDataChecker from "./../middlewares/NewUserDataChecker";
import CheckPassword from "../middlewares/CheckPassword";
import protectedRoute from "../middlewares/protectRoute";
import isUserVerified from "../middlewares/isUserVerified";
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

router.put(
  "/makeAdmin/:id",
  protectedRoute,
  isUserVerified,
  UserController.makeUserAdmin
);

router.get("/profile/:id", UserController.getUserProfile);

router.get("/", UserController.getAllUsers);

export default router;
