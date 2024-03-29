import HttpStatus from "http-status";
import User from "../models/UserModel";
import TokenAuthenticator from "../utils/TokenAuthenticator";
import Response from "../utils/Response";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return Response.errorMessage(
        res,
        "No token found!",
        HttpStatus.NOT_FOUND
      );
    }

    const payload = TokenAuthenticator.decodeToken(token);
    const { name } = payload;
    if (name === "JsonWebTokenError") {
      return Response.errorMessage(
        res,
        "Unauthorized, invalid token",
        HttpStatus.UNAUTHORIZED
      );
    }

    if (name === "TokenExpiredError") {
      return Response.errorMessage(
        res,
        "Unauthorized, Token has expired signin again to get new token",
        HttpStatus.UNAUTHORIZED
      );
    }
    const validUser = await User.findById(payload._id);
    if (!validUser) {
      return Response.errorMessage(
        res,
        "You' re not authorized!",
        HttpStatus.UNAUTHORIZED
      );
    }

    const loggedInUser = {
      _id: validUser._id,
      otp: validUser.otp,
      firstName: validUser?.firstName,
      lastName: validUser?.lastName,
      phone: validUser?.phone,
      email: validUser?.email,
      isVerified: validUser?.isVerified,
    };
    req.user = loggedInUser;
    req.token = token;
    next();
  } catch (error) {
    return Response.errorMessage(
      res,
      "You can not proceed without setting a valid token",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
export default protectedRoute;
