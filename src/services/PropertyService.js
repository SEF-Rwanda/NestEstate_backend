import Property from "../models/propertyModel";

class PropertyService {
  static addProperty = async (req) => {
    req.body.postedBy = req?.user?._id;
    return await Property.create(req.body);
  };

  // get all available properties
  static getAllAvailableProperties = async () => {
    return await Property.find({ isAvailable: true });
  };

  // view user properties
  static getUserProperties = async (req) => {
    return await Property.find({ postedBy: req?.user?._id });
  };
}

export default PropertyService;
