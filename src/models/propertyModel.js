import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    category: {
      type: String,
      required: [true, "Category is required!"],
    },
    section: {
      type: String,
      required: [true, "Section is required!"],
    },
    price: {
      type: String,
      required: [true, "Price is required!"],
    },

    size: {
      type: String,
      required: [true, "Size is required!"],
    },
    upi: {
      type: String,
      required: [true, "UPI is required!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
    },
    mainImage: {
      type: String,
      required: true,
    },
    otherImages: {
      type: Array,
      required: true,
    },
    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    masterPlanUse: {
      type: String,
    },
    masterPlanLevel: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    geoLocation: {
      latitude: String,
      longitude: String,
    },
    parking: {
      type: Boolean,
    },
    tank: {
      type: Boolean,
    },
    furnished: {
      type: Boolean,
    },
    internet: {
      type: Boolean,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
