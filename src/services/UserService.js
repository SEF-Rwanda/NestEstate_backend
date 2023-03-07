import User from "../models/UserModel";
import TokenAuthenticator from "../utils/TokenAuthenticator";
import ValidateLoginInfo from "../middlewares/validateLoginInfo";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Joi from "joi";

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
  static async verifyUser(req, next) {
    const { otp } = req.body;
    const { user } = req;

    const newUser = await User.findOne({
      _id: user._id,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!newUser) return false;
    if (newUser.isVerified) return "verified";

    newUser.isVerified = true;
    newUser.otp = undefined;
    newUser.otpExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    return true;
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
    if (user.isVerified === true) {
      const data = {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
      };

      const token = TokenAuthenticator.signToken(data);
      return res.header("auth-token", token).send({
        token,
      });
    }
    return res.status(404).send("The user is not verified");
  };

  static logoutService = (req, res) => {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: "Logged out successfully" });
  };

  static getUserProfile = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).orFail();
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
      return user;
    } catch (error) {
      console.log(error.message);
    }
  };
}

export default UserService;
