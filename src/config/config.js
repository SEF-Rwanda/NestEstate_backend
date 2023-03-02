import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * @description Connect to MongoDB
* @returns {Promise<void>}

 */
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB connected:${conn.connection.host}`);
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit();
  }
};

export default connectDb;
