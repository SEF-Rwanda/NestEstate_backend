import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, "action is required!"],
    },
    user: {
      type: String,
      required: [true, "action is required!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);

export default Log;
