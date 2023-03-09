import httpStatus from "http-status";
import PropertyService from "../services/PropertyService.js";
import catchAsyncError from "../utils/catchAsyncError";
import Response from "../utils/Response";
import dotenv from "dotenv";

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
    const houses = await PropertyService.getAllAvailableProperties();

    return Response.successMessage(
      res,
      "All available properties",
      houses,
      httpStatus.OK
    );
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

  static updateProperty = catchAsyncError(async (req, res) => {
    try {
      const property = await PropertyService.updateProperty(req, res);
      if (property) {
        return Response.successMessage(
          res,
          "Property updated successfully",
          property,
          httpStatus.CREATED
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
}

export default PropertyController;
