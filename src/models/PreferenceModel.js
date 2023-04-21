import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required!"],
    },
    section: {
      type: String,
    },
    price: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },

    size: {
      type: Number,
      required: [true, "Size is required!"],
    },

    bedrooms: {
      type: Number,
    },
    furnished: {
      type: Boolean,
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

const Preference = mongoose.model("Preference", preferenceSchema);

export default Preference;
