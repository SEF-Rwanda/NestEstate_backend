import User from "../models/UserModel";
import HttpStatus from "http-status";
import Response from "../utils/Response";

class NewUserDataChecker {
  static validateCredentials = async (req, res, next) => {
    const { email } = req.body;
    const result = await User.findOne({ email });

    if (result) {
      return Response.errorMessage(
        res,
        "Account associated with this email already exists",
        HttpStatus.CONFLICT
      );
    }
    next();
  };
}

export default NewUserDataChecker;
