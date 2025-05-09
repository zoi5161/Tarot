import express, { Express, Request, response, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import chatRoutes from './routers/chatRoutes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT_BACKEND || 5000;  

app.use(
    cors({
        origin: 'http://localhost:5173',  // Cho phép từ địa chỉ này
        methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Các phương thức HTTP cho phép
        allowedHeaders: ['Content-Type', 'Authorization'],  // Các header cho phép
        credentials: true,  // Nếu bạn muốn sử dụng cookies, credentials cần phải bật
    })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', chatRoutes);

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
