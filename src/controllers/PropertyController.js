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

  // static getAllAvailableProperties = catchAsyncError(async (req, res, next) => {
  //   const houses = await PropertyService.getAllAvailableProperties();

  //   return Response.successMessage(
  //     res,
  //     "All available properties",
  //     houses,
  //     httpStatus.OK
  //   );
  // });

  static getAllAvailableProperties = catchAsyncError(async (req, res, next) => {
    const { page, perPage } = req.query;
    const properties = await PropertyService.getAllAvailableProperties(
      perPage,
      page
    );

    return Response.successMessage(
      res,
      "All available properties",
      properties,
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
}

export default PropertyController;
