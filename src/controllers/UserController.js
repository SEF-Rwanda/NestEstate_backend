import httpStatus from "http-status";
import UserService from "../services/UserService";
import User from "../models/UserModel";
import catchAsyncError from "../utils/catchAsyncError";
import Response from "../utils/Response";
import dotenv from "dotenv";
import Email from "../utils/Email";
import TokenAuthenticator from "./../utils/TokenAuthenticator";
import crypto from "crypto";

dotenv.config();

class UserController {
  static createUser = catchAsyncError(async (req, res) => {
    try {
      const newUser = await UserService.createUser(req, res);
      if (newUser) {
        newUser.password = "";
        const { password, ...data } = newUser;

        const token = TokenAuthenticator.signToken(data._doc);

        const newData = { ...data._doc, token };

        const response = await Email.verificationEmail(req, data._doc);

        return Response.successMessage(
          res,
          "User created successfully,proceed to verify you account",
          newData,
          httpStatus.CREATED
        );
      }
      return Response.errorMessage(
        res,
        "Something went wrong,please try again",
        httpStatus.BAD_REQUEST
      );
    } catch (error) {
      return Response.errorMessage(
        res,
        error.message,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  });

  static forgotPassword = catchAsyncError(async (req, res, next) => {
    // Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // return next(new AppError("There is no user with email address.", 404));
      return Response.errorMessage(
        res,
        "There is no user with email address.",
        httpStatus.NOT_FOUND
      );
    }

    // Generate the random reset token
    // const resetToken = TokenAuthenticator.signToken(user._doc);
    // await user.save({ validateBeforeSave: false });
    // console.log(resetToken);

    // another approach
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it to user's email

    const resetURL = `${req.protocol}://localhost:3000/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    const response = await Email.resetPasswordEmail(req, user, message);

    res.status(200).json({
      status: "success",
      resetToken,
      message: "Token sent to email!",
    });
  });

  static resetPassword = catchAsyncError(async (req, res, next) => {
    // Get user based on the token

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // if token has not expired, and there is user, set the new password

    if (!user) {
      return Response.errorMessage(
        res,
        "Token is invalid or has expired",
        httpStatus.BAD_REQUEST
      );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Update changedPasswordAt property for the user

    // Log the user in, send JWT

    // const token = user.createPasswordResetToken();
    // hash the above token and return it
    const newToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    res.status(200).json({
      status: "success",
      newToken,

      message: "Password reset successfully",
    });
  });

  static login = catchAsyncError(async (req, res) => {
    return UserService.loginService(req, res);
  });

  static logout = catchAsyncError(async (req, res) => {
    return UserService.logoutService(req, res);
  });

  static verifyEmail = catchAsyncError(async (req,res) => {
    return await UserService.verifyUser(req,res);
  });

  static updateUserProfile = catchAsyncError(async (req, res) => {
    try {
      const user = await UserService.updateUserProfile(req, res);
      if (user) {
        user.password = "";
        return Response.successMessage(
          res,
          "User profile updated successfully",
          user,
          httpStatus.CREATED
        );
      }
      return Response.errorMessage(
        res,
        "Something went wrong,please try again",
        httpStatus.BAD_REQUEST
      );
    } catch (error) {
      return Response.errorMessage(
        res,
        error.message,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  });

  static getUserProfile = catchAsyncError(async (req, res) => {
    try {
      const user = await UserService.getUserProfile(req, res);
      if (user) {
        return Response.successMessage(
          res,
          "User profile retrieved successfully",
          user,
          httpStatus.OK
        );
      }
      return Response.errorMessage(
        res,
        "Something went wrong,please try again",
        httpStatus.BAD_REQUEST
      );
    } catch (error) {
      return Response.errorMessage(
        res,
        error.message,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  });
}

export default UserController;
