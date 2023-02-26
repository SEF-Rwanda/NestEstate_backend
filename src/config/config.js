import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://elie:1234567890@cluster0.umerjgm.mongodb.net/?retryWrites=true&w=majority",
      // "mongodb+srv://chadrackngirimana:safari1006@cluster0.l1sh37o.mongodb.net/?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );

    console.log(`MongoDB connected:${conn.connection.host}`);
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit();
  }
};

export default connectDb;
