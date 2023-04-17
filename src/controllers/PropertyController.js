import httpStatus from "http-status";
import PropertyService from "../services/PropertyService.js";
import catchAsyncError from "../utils/catchAsyncError";
import Response from "../utils/Response";
import dotenv from "dotenv";
import moment from "moment";
import Property from "../models/propertyModel.js";

dotenv.config();

class PropertyController {
  static addProperty = catchAsyncError(async (req, res, next) => {
    const houses = await PropertyService.addProperty(req);

    return Response.successMessage(
      res,
      "Property created successfully!",
      houses,
      httpStatus.CREATED
    );
  });

  static getAllAvailableProperties = catchAsyncError(async (req, res, next) => {
    const {
      perPage,
      page,
      priceMin,
      priceMax,
      title,
      description,
      section,
      category,
      size,
      bedrooms,
      bathrooms,
      parking,
      furnished,
      internet,
    } = req.query;
    const properties = await PropertyService.getAllAvailableProperties(
      perPage,
      page,
      parseInt(priceMin),
      parseInt(priceMax),
      title,
      description,
      section,
      category,
      size,
      bedrooms,
      bathrooms,
      parking,
      furnished,
      internet
    );

    const totalProperties = await PropertyService.countAllAvailableProperties();

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "All available properties",
      totalProperties,
      data: properties,
    });
  });

  static getUserProperties = catchAsyncError(async (req, res, next) => {
    const houses = await PropertyService.getUserProperties(req);

    return Response.successMessage(
      res,
      "All available properties",
      houses,
      httpStatus.OK
    );
  });

  static getSingleProperty = catchAsyncError(async (req, res) => {
    try {
      const property = await PropertyService.getSingleProperty(req, res);
      if (property) {
        return Response.successMessage(
          res,
          "Property retrieved successfully",
          property,
          httpStatus.OK
        );
      }
      return Response.errorMessage(
        res,
        "Something went wrong,please try again",
        httpStatus.BAD_REQUEST
      );
    } catch (error) {
      return Response.errorMessage(
        res,
        error.message,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  });

  static updateProperty = catchAsyncError(async (req, res) => {
    try {
      const property = await PropertyService.updateProperty(req, res);
      if (property) {
        return Response.successMessage(
          res,
          "Property updated successfully",
          property,
          httpStatus.OK
        );
      }
      return Response.errorMessage(
        res,
        "Something went wrong,please try again",
        httpStatus.BAD_REQUEST
      );
    } catch (error) {
      return Response.errorMessage(
        res,
        error.message,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  });

  static hideProperty = catchAsyncError(async (req, res, next) => {
    const property = await PropertyService.hideProperty(req);

    return Response.successMessage(
      res,
      "Property hidden successfully",
      property,
      httpStatus.OK
    );
  });

  static unhideProperty = catchAsyncError(async (req, res, next) => {
    const property = await PropertyService.unhideProperty(req);

    return Response.successMessage(
      res,
      "Property unhidden successfully",
      property,
      httpStatus.OK
    );
  });

  static approveProperty = catchAsyncError(async (req, res, next) => {
    const property = await PropertyService.approveProperty(req);

    return Response.successMessage(
      res,
      "Property approved successfully",
      property,
      httpStatus.OK
    );
  });

  static getAllProperties = catchAsyncError(async (req, res, next) => {
    const { page, perPage, startDate, endDate } = req.query;
    // Validate input dates using moment.js library

    try {
      let startDateObj = null;
      let endDateObj = null;
      if (startDate && endDate) {
        startDateObj = new Date(startDate);
        endDateObj = new Date(endDate);
        const isValidStartDate = moment(
          startDate,
          moment.ISO_8601,
          true
        ).isValid();
        const isValidEndDate = moment(endDate, moment.ISO_8601, true).isValid();

        if (!isValidStartDate || !isValidEndDate) {
          return res.status(400).json({ message: "Invalid date format" });
        }
        // Check if startDateObj and endDateObj are valid Date objects
        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
        }
      }
      const properties = await PropertyService.getAllProperties(
        perPage,
        page,
        startDateObj,
        endDateObj
      );

      return Response.successMessage(
        res,
        "All properties",
        properties,
        httpStatus.OK
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // get all count for property
  static getAllCount = catchAsyncError(async (req, res, next) => {
    const totalProperties = await PropertyService.countAllAvailableProperties();

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Counts",
      counts: totalProperties,
    });
  });
}

export default PropertyController;
