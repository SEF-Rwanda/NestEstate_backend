import catchAsyncError from "../utils/catchAsyncError";
import dotenv from "dotenv";
import PaymentModel from "../models/paymentModel";
import PaymentService from "../services/PaymentService";
import Response from "../utils/Response";
const Stripe = require("stripe");
import httpStatus from "http-status";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

dotenv.config();

class PaymentController {
  static makePayment = catchAsyncError(async (req, res) => {

    console.log("First User Id")
    console.log(req.body.userId)
    console.log("===============================")

    const property = req.body.property.property;
    const orderData = {
      id: property._id,
      title: property.title,
      description: property.description,
      price: property.price,
      category: property.category,
      section: property.section,
    };

    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        property: JSON.stringify(orderData),
      },
    });
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: property.title,
              description: property.description,
              // Make images dynamic
              images: [property.mainImage.url],
            },
            unit_amount: property.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout_success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout_cancel`,
    });

    res.send({ url: session.url });
  });

  // Create payment

  static createPayment = async (customer, data) => {
    // Get the property data to be saved in the database
    const property = JSON.parse(customer.metadata.property);
    const userId = customer.metadata.userId;

    const customerId = data.customer;
    const pametnIntentId = data.payment_intent;
    const newPayment = new PaymentModel({
      userId,
      email: data.customer_details.email,
      name: data.customer_details.name,
      customerId,
      pametnIntentId,
      property,
    });
    try {
      const savedPayment = await newPayment.save();
      console.log(savedPayment);
    } catch (err) {
      console.log(err.message);
    }
  };

  static webhook = catchAsyncError(async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          this.createPayment(customer, data);
        })
        .catch((err) => console.log(err.message));
    }
    res.status(200).end();
  });

  // View my payments
  static viewMyPayments = catchAsyncError(async (req, res) => {
    const payments = await PaymentService.viewMyPayments(req);
    return Response.successMessage(
      res,
      "All Payments",
      payments,
      httpStatus.OK
    );
  });

  // View all payments
  static viewAllPayments = catchAsyncError(async (req, res) => {
    const payments = await PaymentService.viewAllPayments();
    res.status(200).json({
      status: "success",
      data: payments,
    });
  });
}

export default PaymentController;
