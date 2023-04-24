import mongoose from "mongoose";

const paymentModelSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, nullable: true },
    name: { type: String, nullable: true },
    customerId: { type: String },
    paymentIntentId: { type: String },
    property: {
      id: {
        type: String,
      },
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      price: {
        type: Number,
      },
      category: {
        type: String,
      },
      section: {
        type: String,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const PaymentModel = mongoose.model("Payment", paymentModelSchema);

export default PaymentModel;
