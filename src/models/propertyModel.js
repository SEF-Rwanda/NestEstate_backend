import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required!'],
    },
    category: {
      type: String,
      required: [true, 'Category is required!'],
    },
    section: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Price is required!'],
    },

    size: {
      type: Number,
      required: [true, 'Size is required!'],
    },
    upi: {
      type: String,
      required: [true, 'UPI is required!'],
    },
    description: {
      type: String,
      required: [true, 'Description is required!'],
    },
    mainImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    otherImages: {
      type: Array,
      required: true,
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    masterPlanUse: {
      type: String,
    },
    masterPlanLevel: {
      type: String,
      default: 'R1',
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
      default: false,
    },
    tank: {
      type: Boolean,
      default: false,
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    internet: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

const Property = mongoose.model('Property', propertySchema);

export default Property;
