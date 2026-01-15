import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB CONNECTED TO", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to DB, ", error);
    process.exit(1); // status code 1 means failed and 0 means success
  }
};
