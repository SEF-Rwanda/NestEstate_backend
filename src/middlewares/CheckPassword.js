import httpStatus from "http-status";
import Response from "../utils/Response";

class CheckPassword {
  static checkPassword(req, res) {
    const { password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return Response.errorMessage(
        res,
        "Your password should be similar!",
        httpStatus.BAD_REQUEST
      );
    }
    next();
  }
}

export default CheckPassword;
