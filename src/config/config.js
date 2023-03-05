import mongoose from "mongoose";
import dotenv from "dotenv";
import connectTestingDb from "../utils/connectTestingServer";
dotenv.config({ path: "./.env" });

/**
 * @description Connect to MongoDB
* @returns {Promise<void>}

 */
const connectDb = async () => {
  try {
    if (process.env.NODE_ENV === "test") {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log(`MongoDB connected:${conn.connection.host}`);
    } else {
      await connectTestingDb();
    }
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit();
  }
};

export default connectDb;
