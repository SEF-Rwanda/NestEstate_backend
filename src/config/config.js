import mongoose from "mongoose";
import dotenv from "dotenv";
import connectTestingDb from "./../utils/connectTestingServer";
import checkEnv from "../utils/checkTestEnv";

dotenv.config({ path: "./.env" });

/**
 * @description Connect to MongoDB
* @returns {Promise<void>}

 */
const connectDb = async () => {
  try {
    if (checkEnv(process.env.NODE_ENV, "TEST")) {
      console.log("TEST");
      await connectTestingDb();
    } else {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      console.log(`MongoDB connected:${conn.connection.host}`);
    }
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit();
  }
};

export default connectDb;
