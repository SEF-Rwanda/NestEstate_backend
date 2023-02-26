import express from "express";
import UserController from "../controllers/UserController";
import NewUserDataChecker from "./../middlewares/NewUserDataChecker";
import CheckPassword from "../middlewares/CheckPassword";
var cors = require('cors')

const router = express.Router();

router.post(
  "/signup",
  NewUserDataChecker.validateCredentials,
  CheckPassword.checkPassword,

  UserController.createUser
);

router.post("/login", cors(), UserController.login)

router.post("/logout", UserController.logout)

export default router;
