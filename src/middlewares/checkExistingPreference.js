import Preference from "../models/PreferenceModel";
import httpStatus from "http-status";
import Response from "../utils/Response";

export const checkExistingPreference = async (req, res, next) => {
  const result = await Preference.findOne({ postedBy: req?.user?._id });

  if (result) {
    return Response.errorMessage(
      res,
      "Preference associated with this user already exists",
      httpStatus.CONFLICT
    );
  }

  next();
};
