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
        const users = await User.countDocuments();
        const properties = await Property.countDocuments();
        const data = {
            users,
            properties
        }
        return data;
    };
}


export default ReportService;
