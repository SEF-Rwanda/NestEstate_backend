import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const connectTestingDb = async () => {
  try {
    let mongoServer = new MongoMemoryServer();
    await mongoServer.start();
    const mongoUri = mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB connected:${conn.connection.host}`);
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit();
  }
};

export default connectTestingDb;
