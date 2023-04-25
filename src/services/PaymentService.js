import PaymentModel from "../models/paymentModel";

class PaymentService {
  // view payement for logged in user
  static viewMyPayments = async (req) => {
    const payments = await PaymentModel.find({
      userId: req?.user?._id,
    }).sort({ createdAt: -1 });
    return payments;
  };

  // view all payments
  static viewAllPayments = async () => {
    const payments = await PaymentModel.find();
    return payments;
  };
}

export default PaymentService;
