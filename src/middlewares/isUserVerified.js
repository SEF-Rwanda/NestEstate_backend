import HttpStatus from "http-status";
import Response from "../utils/Response";

const isUserVerified = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user.isVerified) {
      return Response.errorMessage(
        res,
        "User is not verified",
        HttpStatus.UNAUTHORIZED
      );
    }
    next();
  } catch (err) {
    return Response.errorMessage(
      res,
      err.message,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export default isUserVerified;
