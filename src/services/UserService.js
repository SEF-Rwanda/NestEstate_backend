import User from "../models/UserModel";
import TokenAuthenticator from "../utils/TokenAuthenticator";
import ValidateLoginInfo from "../middlewares/validateLoginInfo";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import Response from "../utils/Response";
import Log from "../models/LogModel";
import jwt_decode from "jwt-decode";

class UserService {
  /**
   * @description This method is used to create a new user
   * @param {object} req
   * @memberof UserService
   * @returns {object} new user data object
   */

  static createUser = async (req, res) => {
    const { firstName, lastName, email, phone, password, passwordConfirm } =
      req.body;
    const { OTP, otpExpires } = TokenAuthenticator.OTPGenerator();

    const newUserObject = {
      firstName,
      lastName,
      email,
      phone,
      password,
      passwordConfirm,
      otp: OTP,
      otpExpires,
    };
    const newUser = await User.create(newUserObject);

    return newUser;
  };

  /**
   * Verifying Users
   * @static
   * @param {object} req  request object
   * @memberof AuthService
   * @returns {object} data
   */
  static async verifyUser(req, res) {
    const { otp } = req.body;
    const { user } = req;
    const newUser = await User.findOne({
      _id: user._id,
      otp: otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!newUser) {
      return Response.errorMessage(
        res,
        "Invalid code or has expired!.",
        httpStatus.BAD_REQUEST
      );
    }

    newUser.isVerified = true;
    newUser.otp = undefined;
    newUser.otpExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    const data = {
      _id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      isVerified: newUser.isVerified,
    };

    const token = TokenAuthenticator.signToken(data);
    const log = new Log({
      user: newUser.firstName + " " + newUser.lastName,
      action: "Registered",
    });
    await log.save();
    return Response.successMessage(
      res,
      "Email verified successfully!",
      token,
      httpStatus.OK
    );
  }

  static loginService = async (req, res, next) => {
    const result = ValidateLoginInfo.validateEmailPassword(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).send("Email doesn't exist");
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (!isValid) {
      return res.status(401).send("Password is incorrect");
    }
    if (user.isVerified !== true) {
      return res.status(404).send({ error: "The user is not verified" });
    }
    const data = {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
    };

    const token = TokenAuthenticator.signToken(data);
    const log = new Log({
      user: user.firstName + " " + user.lastName,
      action: "Logged in",
    });
    await log.save();

    return res.header("auth-token", token).send({
      token,
      data,
    });
  };

  static logoutService = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt_decode(token);

    const log = new Log({
      user: user.firstName + " " + user.lastName,
      action: "Logged out",
    });
    await log.save();

    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
  };

  static getUserProfile = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).orFail();
      const log = new Log({
        user: user.firstName + " " + user.lastName,
        action: "Checked profile",
      });
      await log.save();
      return user;
    } catch (error) {
      console.log(error.message);
    }
  };

  static updateUserProfile = async (req, res, next) => {
    try {
      const user_id = req.params.id; //"63f6156fb4119d78eab6638b"
      const user = await User.findById(user_id).orFail();
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.photo = req.body.photo || user.photo;
      await user.save({ validateBeforeSave: false });
      const log = new Log({
        user: user.firstName + " " + user.lastName,
        action: "Updated profile",
      });
      await log.save();
      return user;
    } catch (error) {
      console.log(error.message);
    }
  };

  static getAllUsers = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt_decode(token);

    const log = new Log({
      user: user.firstName + " " + user.lastName,
      action: "Viewed all Users",
    });
    await log.save();

    const users = await User.find({}).select("-password");
    return users;
  };

  // Approve a property by only admin
  static makeUserAdmin = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const theuser = jwt_decode(token);

    const user_id = req.params.id;
    const user = await User.findById(user_id).orFail();

    if (user.isAdmin === true) {
      user.isAdmin = false;
      const log = new Log({
        user: theuser.firstName + " " + theuser.lastName,
        action:
          "Made" + user.firstName + " " + user.lastName + " an normal user ",
      });
      await log.save();
    } else {
      user.isAdmin = true;
      const log = new Log({
        user: theuser.firstName + " " + theuser.lastName,
        action: "Made" + user.firstName + " " + user.lastName + " an Admin ",
      });
      await log.save();
    }
    await user.save({ validateBeforeSave: false });
  };

  static getLogs = async (startDate, endDate) => {
    let filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }
    const options = {
      sort: { createdAt: -1 },
    };

    console.log("Reached Here");
    const logs = await Log.find(filter, null, options);
    return logs;
  };
}

export default UserService;
