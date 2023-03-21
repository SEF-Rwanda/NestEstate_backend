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
    // return Response.successMessage(
    //   res,
    //   "All available properties",
    //   properties,
    //   page,
    //   httpStatus.OK
    // );
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
