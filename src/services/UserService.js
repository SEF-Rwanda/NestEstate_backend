import User from "../models/UserModel";
import TokenAuthenticator from "../utils/TokenAuthenticator";

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
    try {
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
    } catch (error) {
      console.log(error.message);
    }
  };
  /**
   * Admin verify Users
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

    newUser.isVerified = true;
    newUser.otp = undefined;
    newUser.otpExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    return true;
  }
}

export default UserService;
