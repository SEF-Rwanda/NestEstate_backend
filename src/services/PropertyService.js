import Property from "../models/propertyModel";

class PropertyService {
  static addProperty = async (req) => {
    req.body.postedBy = req?.user?._id;
    return await Property.create(req.body);
  };

  static updateProperty = async (req, res, next) => {
    try {
      const property_id = req.params.id; //"63f6156fb4119d78eab6638b"
      const property = await Property.findById(property_id).orFail();
      property.title = req.body.title || property.title;
      property.category = req.body.category || property.category;
      property.price = req.body.price || property.price;
      property.size = req.body.size || property.size;
      property.upi = req.body.upi || property.upi;
      property.description = req.body.description || property.description;
      property.mainImage = req.body.mainImage || property.mainImage;
      property.otherImages = req.body.otherImages || property.otherImages;
      property.bedrooms = req.body.bedrooms;
      property.bathrooms = req.body.bathrooms;
      property.masterPlanUse = req.body.masterPlanUse;
      property.masterPlanLevel = req.body.masterPlanLevel;
      property.streetAddress = req.body.streetAddress;
      property.geoLocation = req.body.geoLocation;
      property.tank = req.body.tank;
      property.furnished = req.body.furnished;
      property.internet = req.body.internet;
      await property.save({ validateBeforeSave: false });
      return property;
    } catch (error) {
      console.log(error.message);
    }
  };
}

export default PropertyService;
