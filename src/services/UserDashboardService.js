import User from "../models/UserModel";
import Property from "../models/propertyModel";

class UserDashboardService {
  /**
   * @description This method is used to create a new user
   * @param {object} req
   * @memberof ReportService
   * @returns {object} new user data object
   */

  static userRecords = async (req) => {
    const totalProperties = await Property.find({
        postedBy: req?.user?._id,
        
      }).countDocuments();

    // total number of hidden properties
    const totalHiddenProperties = await Property.find({
        postedBy: req?.user?._id,
        isHidden: true,
      }).countDocuments();

    // total number of unhidden properties
    const totalUnhiddenProperties = await Property.find({
        postedBy: req?.user?._id,
        isHidden: false,
      }).countDocuments();

    // total number of approved properties
    const totalApprovedProperties = await Property.find({
        postedBy: req?.user?._id,
        isApproved: true,
        isHidden: false,
      }).countDocuments();

    // total number of unapproved properties
    const totalUnapprovedProperties = await Property.find({
        postedBy: req?.user?._id,
        isApproved: false,
        isHidden: false,
      }).countDocuments();

    // total number of available properties
    const totalAvailableProperties = await Property.find({
        postedBy: req?.user?._id,
        isAvailable: true,
      }).countDocuments();

    // total number of unavailable properties
    const totalUnavailableProperties = await Property.find({
        postedBy: req?.user?._id,
        isAvailable: false,
      }).countDocuments();

    // total number of houses
    const totalHouseProperties = await Property.find({
        postedBy: req?.user?._id,
        category: "House",
      }).countDocuments();

    // total number of plots
    const totalPlotProperties = await Property.find({
        postedBy: req?.user?._id,
        category: "Plot",
      }).countDocuments();

    // total nubmer of houses for sale
    const totalHouseForSale = await Property.find({
      postedBy: req?.user?._id,
      category: "House",
      section: "For Sale",
      isHidden: false,
    }).countDocuments();

    // total number of houses for rent
    const totalHouseForRent = await Property.find({
      postedBy: req?.user?._id,
      category: "House",
      section: "For Rent",
      isHidden: false,
    }).countDocuments;

    // total number of available plots
    const totalAvailablePlots = await Property.find({
      postedBy: req?.user?._id,
      category: "Plot",
      isAvailable: true,
      isHidden: false,
    }).countDocuments();

    const data = {
        
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
    };
    return data;
  };
}

export default UserDashboardService;
