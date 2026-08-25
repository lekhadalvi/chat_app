import express from 'express';
import dotenv from 'dotenv'
import { sendOtpToConsumer } from './consumer.js';


dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json())
sendOtpToConsumer();
app.listen(PORT ,()=>{
console.log(`🚀 Server running on http://localhost:${PORT}`);
})