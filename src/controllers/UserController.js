import httpStatus from "http-status";
import UserService from "../services/UserService";
import User from "../models/UserModel";
import catchAsyncError from "../utils/catchAsyncError";
import Response from "../utils/Response";
import dotenv from "dotenv";
import Email from "../utils/Email";
import TokenAuthenticator from "./../utils/TokenAuthenticator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

  static login = catchAsyncError(async (req, res) => {
    return UserService.loginService(req, res)
  });

  static logout = catchAsyncError(async (req, res) => {
    return UserService.logoutService(req, res)
  });


  static verifyEmail = catchAsyncError(async (req, res, next) => {
    const verified = await UserService.verifyUser(req);

    if (!verified) {
      return next(
        Response.errorMessage(
          res,
          "Invalid code or has expired!.",
          httpStatus.BAD_REQUEST
        )
      );
    }
    if (verified === "verified") {
      Response.errorMessage(res, "This is already!.", httpStatus.BAD_REQUEST);
    }
    return Response.successMessage(
      res,
      "Email verified successfuly!",
      null,
      httpStatus.OK
    );
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
