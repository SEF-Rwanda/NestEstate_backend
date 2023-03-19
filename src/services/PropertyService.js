import Property from "../models/propertyModel";
import cloudinary from "../utils/cloudinary";

class PropertyService {
  static addProperty = async (req) => {
    req.body.postedBy = req?.user?._id;
    return await Property.create(req.body);
  };

  static getAllAvailableProperties = async (perPage, page) => {
    const options = {
      skip: (page - 1) * perPage,
      limit: perPage,
      sort: { createdAt: -1 },
    };

    const properties = await Property.find(
      {
        isAvailable: true,
        isHidden: false,
        isApproved: true,
      },
      null,
      options
    );
    return properties;
  };

  static getUserProperties = async (req) => {
    return await Property.find({
      postedBy: req?.user?._id,
      isHidden: false,
      isApproved: true,
    });
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
      property.masterPlanLevel =
        req.body.masterPlanLevel || property.masterPlanLevel;
      property.streetAddress = req.body.streetAddress || property.streetAddress;
      property.geoLocation = req.body.geoLocation || property.geoLocation;
      property.parking = req.body.parking || property.parking;
      property.tank = req.body.tank || property.tank;
      property.furnished = req.body.furnished || property.furnished;
      property.internet = req.body.internet || property.internet;

      if (req.body.category === "Land") {
        property.bedrooms = 0;
        property.bathrooms = 0;
        property.furnished = false;
        property.internet = false;
        property.parking = false;
        property.tank = false;
      }

      // check if user uploaded main Image
      if (req.body.mainImage !== "") {
        const ImgId = property.mainImage.public_id;

        // delete old image
        if (ImgId) {
          await cloudinary.uploader.destroy(ImgId);
        }

        const newImage = await cloudinary.uploader.upload(req.body.mainImage, {
          folder: "properties",
          width: 1000,
          crop: "scale",
        });

        property.mainImage = {
          public_id: newImage.public_id,
          url: newImage.secure_url,
        };
      }
      await property.save({ validateBeforeSave: false });
      return property;
    } catch (error) {
      console.log(error.message);
    }
  };

  // Hide a property
  static hideProperty = async (req) => {
    const property_id = req.params.id;
    const property = await Property.findById(property_id).orFail();

    property.isHidden = true;

    await property.save();
  };

  // admin to unhide a property
  static unhideProperty = async (req) => {
    const property_id = req.params.id;
    const property = await Property.findById(property_id).orFail();

    property.isHidden = false;

    await property.save();
  };

  // Approve a property by only admin
  static approveProperty = async (req) => {
    const property_id = req.params.id;
    const property = await Property.findById(property_id).orFail();

    property.isApproved = true;

    await property.save();
  };
}

export default PropertyService;
