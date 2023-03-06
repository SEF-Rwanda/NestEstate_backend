import Property from "../models/propertyModel";

class PropertyService {
  static addProperty = async (req) => {
    req.body.postedBy = req?.user?._id;
    return await Property.create(req.body);
  };
}

export default PropertyService;
