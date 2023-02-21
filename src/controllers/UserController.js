import httpStatus from "http-status";
import UserService from "../services/UserService";
import catchAsyncError from "../utils/catchAsyncError";
import Response from "../utils/Response";
import dotenv from "dotenv";
import Email from "../utils/Email";
import TokenAuthenticator from "./../utils/TokenAuthenticator";

dotenv.config();

class UserController {
  static createUser = catchAsyncError(async (req, res) => {
    try {
      const newUser = await UserService.createUser(req, res);
      if (newUser) {
        newUser.password = "";
        const { password, ...data } = newUser;
        const token = TokenAuthenticator.tokenGenerator(data._doc);
        const newData= {...data._doc,token};
        
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
}

export default UserController;
