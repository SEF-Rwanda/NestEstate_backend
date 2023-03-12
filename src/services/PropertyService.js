import Property from "../models/propertyModel";

class PropertyService {
  static addProperty = async (req) => {
    req.body.postedBy = req?.user?._id;
    return await Property.create(req.body);
  };

  // get all available properties
  // static getAllAvailableProperties = async () => {
  //   return await Property.find({ isAvailable: true }).sort({ createdAt: -1 });
  // };

  static getAllAvailableProperties = async (perPage, page) => {
    const options = {
      skip: (page - 1) * perPage,
      limit: perPage,
      sort: { createdAt: -1 },
    };

    const properties = await Property.find(
      { isAvailable: true },
      null,
      options
    );

    return properties;
  };

  // view user properties
  static getUserProperties = async (req) => {
    return await Property.find({ postedBy: req?.user?._id });
  };
}

export default PropertyService;
