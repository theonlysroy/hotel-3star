import mongoose from "mongoose";

const connectDb = async function () {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb://127.0.0.1:27017/HotelDb",
      {
        connectTimeoutMS: 5000,
      },
    );
    // console.log("--- MONGODB CONNECTED ---");
    // console.log(`Db Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    throw new Error(`--- DB CONNECTION ERROR --- ${error}`);
  }
};

export default connectDb;
