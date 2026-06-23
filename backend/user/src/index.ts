import express from 'express';
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import { createClient } from 'redis';
dotenv.config()


const app = express();
const PORT = process.env.PORT

connectDB();
export const redisClient = createClient({
    url: process.env.REDIS_URL!,
});
redisClient.connect().then(()=>console.log("connected to redis")).catch(console.error);

app.listen(PORT ,()=>{
console.log(`🚀 Server running on http://localhost:${PORT}`);
})