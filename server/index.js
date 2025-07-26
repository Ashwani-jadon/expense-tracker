import express from "express";
import dotenv from 'dotenv';
import connectDb from "./config/db.js"
import userRoute from './Routes/user.route.js';
import expenseRoute from './Routes/expense.route.js';
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app=express();
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/expenses', expenseRoute);
const port=process.env.PORT;
app.listen(port,()=>{
    connectDb();
    console.log(`server is running on port ${port}`);  
})




