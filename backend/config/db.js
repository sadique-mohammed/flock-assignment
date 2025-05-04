import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to DB: ${conn.connection.host}`);
  } catch (error) {
    console.err(`Connection to DB failed, Error: ${error}`);
    process.exit(1);
  }
};

export default connectToDB;
