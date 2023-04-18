import User from "../models/UserModel";
import Property from "../models/propertyModel";
import Log from "../models/LogModel";
import jwt_decode from "jwt-decode";

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

    // total number of hidden properties
    const totalHiddenProperties = await Property.countDocuments({
      isHidden: true,
    });

    // total number of unhidden properties
    const totalUnhiddenProperties = await Property.countDocuments({
      isHidden: false,
    });

    // total number of approved properties
    const totalApprovedProperties = await Property.countDocuments({
      isApproved: true,
    });

    // total number of unapproved properties
    const totalUnapprovedProperties = await Property.countDocuments({
      isApproved: false,
    });

    // total number of available properties
    const totalAvailableProperties = await Property.countDocuments({
      isAvailable: true,
    });

    // total number of unavailable properties
    const totalUnavailableProperties = await Property.countDocuments({
      isAvailable: false,
    });

    // total number of houses
    const totalHouseProperties = await Property.countDocuments({
      category: "House",
    });

    // total number of plots
    const totalPlotProperties = await Property.countDocuments({
      category: "Plot",
    });

    // total nubmer of houses for sale
    const totalHouseForSale = await Property.countDocuments({
      category: "House",
      section: "For Sale",
    });

    // total number of houses for rent
    const totalHouseForRent = await Property.countDocuments({
      category: "House",
      section: "For Rent",
    });

    // total number of available plots
    const totalAvailablePlots = await Property.countDocuments({
      category: "Plot",
      isAvailable: true,
    });

    // total number of unavailable plots
    const totalUnavailablePlots = await Property.countDocuments({
      category: "Plot",
      isAvailable: false,
    });

    const data = {
      totalUsers,
      totalProperties,
      totalHiddenProperties,
      totalUnhiddenProperties,
      totalApprovedProperties,
      totalUnapprovedProperties,
      totalAvailableProperties,
      totalUnavailableProperties,
      totalHouseProperties,
      totalPlotProperties,
      totalHouseForSale,
      totalHouseForRent,
      totalAvailablePlots,
      totalUnavailablePlots,
    };
    
    const token=req.headers.authorization.split(" ")[1];
    const user = jwt_decode(token);

    const log = new Log({ user: user.firstName+" "+user.lastName, action: "Viewed analytics" });
    await log.save();

    return data;
  };
}

export default ReportService;
