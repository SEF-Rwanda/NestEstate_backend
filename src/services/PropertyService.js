import Property from "../models/propertyModel";
import cloudinary from "../utils/cloudinary";

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

   // view single property
   static getSingleProperty = async (req, res, next) => {
    try {
      const property = await Property.findById(req.params.id).orFail();
      return property;
    } catch (error) {
      console.log(error.message);
    }
  };


  // update profile
  static updateProperty = async (req, res, next) => {
    try {
      const property_id = req.params.id; 
      const property = await Property.findById(property_id).orFail();

      property.title = req.body.title || property.title;
      property.category = req.body.category || property.category;
      property.section = req.body.section || property.section;
      property.price = req.body.price || property.price;
      property.size = req.body.size || property.size;
      property.upi = req.body.upi || property.upi;
      property.description = req.body.description || property.description;
      property.mainImage = req.body.mainImage || property.mainImage;
      property.otherImages = req.body.otherImages || property.otherImages;
      property.bedrooms = req.body.bedrooms || property.bedrooms;
      property.bathrooms = req.body.bathrooms || property.bathrooms;
      property.masterPlanUse = req.body.masterPlanUse || property.masterPlanUse;
      property.masterPlanLevel = req.body.masterPlanLevel || property.masterPlanLevel;
      property.streetAddress = req.body.streetAddress || property.streetAddress;
      property.geoLocation = req.body.geoLocation || property.geoLocation;
      property.parking=req.body.parking || property.parking;
      property.tank = req.body.tank || property.tank;
      property.furnished = req.body.furnished || property.furnished;;
      property.internet = req.body.internet || property.internet;

      // check if user uploaded main Image
      if (req.body.mainImage !== '') {
        const ImgId = property.mainImage.public_id;
        if (ImgId) {
            await cloudinary.uploader.destroy(ImgId);
        }
  
        const newImage = await cloudinary.uploader.upload(req.body.mainImage, {
            folder: "properties",
            width: 1000,
            crop: "scale"
        });
  
        property.mainImage = {
            public_id: newImage.public_id,
            url: newImage.secure_url
        }
      }

      await property.save({ validateBeforeSave: false });
      return property;

    } catch (error) {
      console.log(error.message);
    }

    

  };
}

export default PropertyService;
