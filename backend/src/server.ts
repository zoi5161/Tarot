import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT_BACKEND || 5000;  // Lấy cổng từ .env, mặc định là 5000 nếu không có trong .env

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB connected!!!`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1);
  }
};

// Kết nối MongoDB
connectDB();

// Khởi động server Express
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
