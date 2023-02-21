import User from "../models/UserModel";

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

    try {
      const newUserObject = {
        firstName,
        lastName,
        email,
        phone,
        password,
        passwordConfirm,
      };
      const newUser = await User.create(newUserObject);

      return newUser;
    } catch (error) {
      console.log(error.message);
    }
  };
}

export default UserService;
