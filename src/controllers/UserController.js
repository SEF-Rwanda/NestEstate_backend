import httpStatus from "http-status";
import UserService from "../services/UserService";
import catchAsyncError from "../utils/catchAsyncError";
import Response from "../utils/Response";

//  const accountSid = process.env.TWILIO_ACCOUNT_SID;
//  const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require("twilio")(accountSid, authToken);

import dotenv from "dotenv";
dotenv.config();

class UserController {
  static createUser = catchAsyncError(async (req, res) => {
    try {
      const newUser = await UserService.createUser(req, res);

      // const verifySid = "VAd899728a39c62c993db7e78a9abc7d35";
      // client.verify.v2
      //   .services(verifySid)
      //   .verifications.create({ to: "+250781475108", channel: "sms" })
      //   .then((verification) => console.log(verification.status))
      //   .then(() => {
      //     const readline = require("readline").createInterface({
      //       input: process.stdin,
      //       output: process.stdout,
      //     });
      //     readline.question("Please enter the OTP:", (otpCode) => {
      //       client.verify.v2
      //         .services(verifySid)
      //         .verificationChecks.create({ to: "+250781475108", code: otpCode })
      //         .then((verification_check) =>
      //           console.log(verification_check.status)
      //         )
      //         .then(() => readline.close());
      //     });
      //   });

      return Response.successMessage(
        res,
        "User created successfully,proceed to verify you account",
        newUser,
        httpStatus.CREATED
      );
    } catch (error) {
      console.log(error);
    }
  });
}

export default UserController;
