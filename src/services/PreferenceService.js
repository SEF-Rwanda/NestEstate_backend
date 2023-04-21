import httpStatus from "http-status";
import Response from "../utils/Response";
import Preference from "../models/PreferenceModel";

class PreferenceService {
  static addPreference = async (req) => {
    req.body.postedBy = req?.user?._id;
    return await Preference.create(req.body);
  };
}

export default PreferenceService;
