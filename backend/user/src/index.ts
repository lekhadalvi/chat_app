import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import UserRoutes from './routes/User.route.js';
import { connectRedis } from "./config/redis.js";
import { connectRabbitmq } from './config/rabbitmq.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

connectDB();
connectRedis();
connectRabbitmq();

app.use("/api/v1", UserRoutes);

app.listen(PORT, () => {
    console.log(`🚀 User Service running securely on http://localhost:${PORT}`);
});