import express from 'express';
import dotenv from 'dotenv'
import { sendOtpToConsumer } from './consumer.js';


dotenv.config()

const app = express();
const PORT = process.env.PORT

sendOtpToConsumer();
app.use(express.json())
app.listen(PORT ,()=>{
console.log(`🚀 Server running on http://localhost:${PORT}`);
})