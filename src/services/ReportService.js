import User from "../models/UserModel";
import Property from "../models/propertyModel";

class ReportService {
  /**
   * @description This method is used to create a new user
   * @param {object} req
   * @memberof ReportService
   * @returns {object} new user data object
   */

  static countRecords = async (req) => {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const data = {
      totalUsers,
      totalProperties,
    };
    return data;
  };
}

export default ReportService;
