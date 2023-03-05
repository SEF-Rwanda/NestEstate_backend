import User from "../models/UserModel";
import HttpStatus from "http-status";
import Response from "../utils/Response";

class NewUserDataChecker {
  static validateCredentials = async (req, res, next) => {
    const { email, phone } = req.body;
    const result = await User.findOne({ email });

    if (result && result.email === email) {
      return Response.errorMessage(
        res,
        "Account associated with this email already exists",
        HttpStatus.CONFLICT
      );
    }
    if (result && result.phone === phone) {
      return Response.errorMessage(
        res,
        "Account associated with this phone already exists",
        HttpStatus.CONFLICT
      );
    }

    next();
  };
}

export default NewUserDataChecker;
