import express from 'express';
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import UserRoutes from './routes/User.route.js'
import { connectRedis } from "./config/redis.js";
dotenv.config()


const app = express();
const PORT = process.env.PORT

connectDB();
connectRedis();
app.use("api/v1",UserRoutes)

app.listen(PORT ,()=>{
console.log(`🚀 Server running on http://localhost:${PORT}`);
})