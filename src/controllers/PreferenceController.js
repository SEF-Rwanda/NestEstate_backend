import httpStatus from "http-status";
import catchAsyncError from "../utils/catchAsyncError";
import Response from "../utils/Response";
import PreferenceService from "../services/PreferenceService";

class PreferenceController {
  static addPreference = catchAsyncError(async (req, res, next) => {
    const preference = await PreferenceService.addPreference(req);

    return Response.successMessage(
      res,
      "Preference created successfully!",
      preference,
      httpStatus.CREATED
    );
  });
}

export default PreferenceController;
