import express from "express";
import UserController from "../controllers/UserController";
import NewUserDataChecker from "../middlewares/NewUserDataChecker";
import CheckPassword from "../middlewares/CheckPassword";
import protectedRoute from "../middlewares/protectRoute";
import isUserVerified from "../middlewares/isUserVerified";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 *
 * /api/users/signup:
 *   post:
 *     tags:
 *       - Users
 *     description: Register a new user
 *     parameters:
 *       - name: firstName
 *         description: FirstName
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: LastName
 *         required: true
 *         type: string
 *       - name: email
 *         description: User's email address
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         required: true
 *         type: string
 *       - name: passwordConfirm
 *         description: User's password
 *         required: true
 *         type: string
 *
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Invalid input data
 */

router.post(
  "/signup",
  NewUserDataChecker.validateEmail,
  NewUserDataChecker.validatePhone,
  CheckPassword.checkPassword,
  UserController.createUser
);

router.post("/forgotPassword", UserController.forgotPassword);
router.patch("/resetPassword/:token", UserController.resetPassword);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 *
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     description: Register a new user
 *     parameters:
 *       - name: email
 *         description: User's email address
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         required: true
 *         type: string
 *
 *
 *     responses:
 *       '200':
 *         description: User registered successfully
 *       '400':
 *         description: Invalid input data
 */
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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 *
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     description: Getting all users
 *
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *       '404':
 *         description: Users not found
 */

router.get("/", UserController.getAllUsers);

export default router;
