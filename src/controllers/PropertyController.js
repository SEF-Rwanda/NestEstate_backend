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
}

export default PropertyController;
